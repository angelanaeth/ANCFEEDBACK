/**
 * ANGELA COACH - UNIFIED API
 * Supports BOTH TrainingPeaks AND Intervals.icu
 * 
 * Choose your data source:
 * - TrainingPeaks: Full read/write, OAuth required
 * - Intervals.icu: Full read/write, API key required
 */

import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'
import { IntervalsClient, normalizeIntervalsData } from './intervals/client'

// Type definitions
type Bindings = {
  DB: D1Database
  // TrainingPeaks
  TP_CLIENT_ID: string
  TP_CLIENT_SECRET: string
  TP_AUTH_URL: string
  TP_TOKEN_URL: string
  TP_API_BASE_URL: string
  // Intervals.icu
  INTERVALS_API_KEY: string
  INTERVALS_BASE_URL: string
  // OpenAI
  OPENAI_API_KEY: string
  SESSION_SECRET: string
}

const app = new Hono<{ Bindings: Bindings }>()

app.use('/api/*', cors())
app.use('/static/*', serveStatic({ root: './' }))

// ============================================================================
// INTERVALS.ICU INTEGRATION
// ============================================================================

/**
 * Connect Intervals.icu account (store API key)
 */
app.post('/api/intervals/connect', async (c) => {
  const { athleteId, apiKey } = await c.req.json()
  const { DB } = c.env
  
  try {
    // Test the API key
    const client = new IntervalsClient({ apiKey, baseUrl: c.env.INTERVALS_BASE_URL })
    const athlete = await client.getAthlete(athleteId)
    
    // Store in database
    await DB.prepare(`
      INSERT OR REPLACE INTO users (
        intervals_athlete_id, name, email, intervals_api_key, 
        account_type, data_source, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `).bind(
      athleteId,
      athlete.name,
      athlete.email || '',
      apiKey,
      'athlete',
      'intervals'
    ).run()
    
    return c.json({
      success: true,
      athlete: {
        id: athlete.id,
        name: athlete.name,
        ctl: athlete.ctl,
        atl: athlete.atl,
        tsb: athlete.tsb
      }
    })
  } catch (error) {
    return c.json({ error: 'Failed to connect Intervals.icu', details: error }, 500)
  }
})

/**
 * Analyze athlete from Intervals.icu
 */
app.post('/api/intervals/analyze', async (c) => {
  const { athleteId } = await c.req.json()
  const { DB } = c.env
  
  try {
    // Get stored API key
    const user = await DB.prepare(
      'SELECT * FROM users WHERE intervals_athlete_id = ? AND data_source = ?'
    ).bind(athleteId, 'intervals').first()
    
    if (!user) {
      return c.json({ error: 'Athlete not found. Please connect Intervals.icu first.' }, 404)
    }
    
    // Fetch data from Intervals.icu
    const client = new IntervalsClient({ 
      apiKey: user.intervals_api_key, 
      baseUrl: c.env.INTERVALS_BASE_URL 
    })
    
    const today = new Date().toISOString().split('T')[0]
    const oldest = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    
    const [athlete, workouts, wellness] = await Promise.all([
      client.getAthlete(athleteId),
      client.getWorkouts(athleteId, oldest, today),
      client.getWellness(athleteId, oldest, today)
    ])
    
    // Normalize to Angela's format
    const normalized = normalizeIntervalsData(athlete, workouts, wellness)
    
    // Calculate stress state
    const stressState = determineStressState({
      ctl: athlete.ctl,
      atl: athlete.atl,
      tsb: athlete.tsb,
      hrvRatio: wellness.length > 0 ? wellness[wellness.length - 1].hrv / 60 : 1.0
    })
    
    return c.json({
      dataSource: 'intervals.icu',
      ...normalized,
      stressState
    })
  } catch (error) {
    return c.json({ error: 'Analysis failed', details: error }, 500)
  }
})

/**
 * Post workout to Intervals.icu
 */
app.post('/api/intervals/plan-workout', async (c) => {
  const { athleteId, date, workout } = await c.req.json()
  const { DB } = c.env
  
  try {
    const user = await DB.prepare(
      'SELECT * FROM users WHERE intervals_athlete_id = ? AND data_source = ?'
    ).bind(athleteId, 'intervals').first()
    
    if (!user) {
      return c.json({ error: 'Athlete not found' }, 404)
    }
    
    const client = new IntervalsClient({ 
      apiKey: user.intervals_api_key, 
      baseUrl: c.env.INTERVALS_BASE_URL 
    })
    
    const result = await client.createPlannedWorkout(athleteId, {
      category: workout.type || 'Ride',
      start_date_local: date,
      name: workout.title,
      description: workout.description,
      moving_time: workout.duration * 60,
      load: workout.tss
    })
    
    return c.json({
      success: true,
      dataSource: 'intervals.icu',
      workout: result
    })
  } catch (error) {
    return c.json({ error: 'Failed to create workout', details: error }, 500)
  }
})

// ============================================================================
// UNIFIED ANALYSIS ENDPOINT (Auto-detect data source)
// ============================================================================

/**
 * Analyze athlete from ANY data source (TrainingPeaks or Intervals.icu)
 */
app.post('/api/angela/analyze-unified', async (c) => {
  const { athleteId } = await c.req.json()
  const { DB } = c.env
  
  try {
    // Check what data sources are available
    const user = await DB.prepare(
      'SELECT * FROM users WHERE tp_athlete_id = ? OR intervals_athlete_id = ?'
    ).bind(athleteId, athleteId).first()
    
    if (!user) {
      return c.json({ 
        error: 'Athlete not found',
        suggestion: 'Please connect TrainingPeaks or Intervals.icu first'
      }, 404)
    }
    
    // Route to appropriate data source
    if (user.data_source === 'intervals') {
      // Use Intervals.icu
      const client = new IntervalsClient({ 
        apiKey: user.intervals_api_key, 
        baseUrl: c.env.INTERVALS_BASE_URL 
      })
      
      const athlete = await client.getAthlete(user.intervals_athlete_id)
      const fitness = await client.getCurrentFitness(user.intervals_athlete_id)
      
      return c.json({
        dataSource: 'intervals.icu',
        athlete: {
          id: athlete.id,
          name: athlete.name
        },
        metrics: fitness,
        stressState: determineStressState({ ...fitness, hrvRatio: 1.0 })
      })
    } else {
      // Use TrainingPeaks
      const workoutsResponse = await fetch(
        `${c.env.TP_API_BASE_URL}/v1/workouts?startDate=${getDateDaysAgo(90)}&endDate=${getToday()}`,
        { headers: { 'Authorization': `Bearer ${user.access_token}` } }
      )
      
      const workouts = await workoutsResponse.json() as any[]
      const tssHistory = workouts.map(w => parseFloat(w.TssActual) || 0).filter(tss => tss > 0)
      const metrics = calculateTrainingMetrics(tssHistory)
      
      return c.json({
        dataSource: 'trainingpeaks',
        athlete: {
          id: user.tp_athlete_id,
          name: user.name
        },
        metrics,
        stressState: determineStressState({ ...metrics, hrvRatio: 1.0 })
      })
    }
  } catch (error) {
    return c.json({ error: 'Unified analysis failed', details: error }, 500)
  }
})

// ============================================================================
// ANGELA GPT ENDPOINTS (OpenAI Custom Actions)
// ============================================================================

/**
 * GPT Action: Get athlete data
 * OpenAPI spec endpoint for custom GPT
 */
app.post('/api/gpt/athlete-data', async (c) => {
  const { athleteId, dataSource = 'intervals' } = await c.req.json()
  
  // Return data in GPT-friendly format
  if (dataSource === 'intervals') {
    // Forward to Intervals endpoint
    return c.json(await handleIntervalsAnalysis(athleteId, c))
  } else {
    // Forward to TrainingPeaks endpoint
    return c.json(await handleTPAnalysis(athleteId, c))
  }
})

/**
 * GPT Action: Generate training recommendation
 */
app.post('/api/gpt/recommend', async (c) => {
  const { athleteId, blockType, currentWeekTSS } = await c.req.json()
  
  // Get current metrics
  const analysis = await handleUnifiedAnalysis(athleteId, c)
  const { metrics, stressState } = analysis
  
  // Generate weekly plan
  const weeklyPlan = generateWeeklyPlan({
    currentWeekTSS,
    blockType,
    stressState: stressState.state,
    intensityMod: stressState.intensity,
    sport: 'bike'
  })
  
  return c.json({
    athleteId,
    currentMetrics: metrics,
    stressState: stressState.state,
    recommendation: stressState.recommendation,
    weeklyPlan,
    reasoning: `Based on TSB ${metrics.tsb.toFixed(1)}, you're in ${stressState.state}. ${stressState.recommendation}`
  })
})

/**
 * GPT Action: Post workout
 */
app.post('/api/gpt/post-workout', async (c) => {
  const { athleteId, dataSource, workout } = await c.req.json()
  
  if (dataSource === 'intervals') {
    return c.json(await handleIntervalsWorkoutPost(athleteId, workout, c))
  } else {
    return c.json(await handleTPWorkoutPost(athleteId, workout, c))
  }
})

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getToday() {
  return new Date().toISOString().split('T')[0]
}

function getDateDaysAgo(days: number) {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
}

function calculateTrainingMetrics(tssHistory: number[]) {
  const CTL_TAU = 42
  const ATL_TAU = 7
  
  function ewma(values: number[], tau: number) {
    const alpha = 1 - Math.exp(-1 / tau)
    const result: number[] = []
    let prev = values[0] || 0
    
    for (const val of values) {
      prev = prev + alpha * (val - prev)
      result.push(prev)
    }
    
    return result
  }
  
  const ctl = ewma(tssHistory, CTL_TAU)
  const atl = ewma(tssHistory, ATL_TAU)
  const tsb = ctl.map((c, i) => c - atl[i])
  
  return {
    ctl: ctl[ctl.length - 1] || 0,
    atl: atl[atl.length - 1] || 0,
    tsb: tsb[tsb.length - 1] || 0
  }
}

function determineStressState(metrics: { ctl: number, atl: number, tsb: number, hrvRatio: number }) {
  const { tsb, atl, ctl, hrvRatio } = metrics
  const fatigueIndex = (atl / ctl) - 1
  
  if (tsb < -40 || hrvRatio < 0.8) {
    return { state: 'Compromised', intensity: 0.5, recommendation: 'Rest or very easy recovery only' }
  } else if (tsb < -25 || fatigueIndex > 0.15) {
    return { state: 'Overreached', intensity: 0.7, recommendation: 'Reduce load 30%, focus on recovery' }
  } else if (tsb >= -25 && tsb <= -10) {
    return { state: 'Productive Fatigue', intensity: 1.0, recommendation: 'Continue current block' }
  } else if (tsb > 10 && (atl / ctl) < 0.95) {
    return { state: 'Recovered', intensity: 1.05, recommendation: 'Ready for key sessions or testing' }
  } else if (tsb > 25) {
    return { state: 'Detraining', intensity: 1.1, recommendation: 'Increase load significantly' }
  }
  
  return { state: 'Normal', intensity: 1.0, recommendation: 'Steady progression' }
}

function generateWeeklyPlan(params: {
  currentWeekTSS: number
  blockType: string
  stressState: string
  intensityMod: number
  sport: string
}) {
  const { currentWeekTSS, blockType, intensityMod } = params
  
  const rampFactors: Record<string, number> = {
    'base_durability': 1.06,
    'build_th': 1.05,
    'vo2_max': 1.03,
    'specificity': 1.0,
    'hybrid': 1.04,
    'rebuild': 0.7
  }
  
  const rampFactor = rampFactors[blockType] || 1.0
  const targetWeekTSS = Math.round(currentWeekTSS * rampFactor * intensityMod)
  
  const dailyDistribution = [0.15, 0.18, 0.12, 0.16, 0.10, 0.20, 0.09]
  
  return dailyDistribution.map((factor, index) => ({
    day: index + 1,
    tss: Math.round(targetWeekTSS * factor),
    dayName: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][index]
  }))
}

// Placeholder helpers (implement based on context)
async function handleIntervalsAnalysis(athleteId: string, c: any) {
  return { status: 'intervals analysis' }
}

async function handleTPAnalysis(athleteId: string, c: any) {
  return { status: 'tp analysis' }
}

async function handleUnifiedAnalysis(athleteId: string, c: any) {
  return { metrics: {}, stressState: {} }
}

async function handleIntervalsWorkoutPost(athleteId: string, workout: any, c: any) {
  return { status: 'posted to intervals' }
}

async function handleTPWorkoutPost(athleteId: string, workout: any, c: any) {
  return { status: 'posted to tp' }
}

// ============================================================================
// FRONTEND (Updated with Intervals.icu option)
// ============================================================================

app.get('/', (c) => {
  return c.html(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Angela Coach - Multi-Platform AI Training</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
</head>
<body class="bg-gray-100">
  <div class="min-h-screen">
    <header class="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 shadow-lg">
      <div class="max-w-7xl mx-auto">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center space-x-4">
            <i class="fas fa-brain text-5xl"></i>
            <div>
              <h1 class="text-4xl font-bold">Angela Coach</h1>
              <p class="text-blue-100">AI Training Intelligence - Multi-Platform</p>
            </div>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto p-8">
      <div class="bg-white rounded-lg shadow-lg p-8 mb-8">
        <h2 class="text-3xl font-bold mb-6 text-center">Choose Your Platform</h2>
        
        <div class="grid md:grid-cols-2 gap-8">
          <!-- TrainingPeaks -->
          <div class="border-2 border-blue-200 rounded-lg p-6 hover:border-blue-400 transition">
            <div class="flex items-center mb-4">
              <i class="fas fa-mountain text-blue-500 text-4xl mr-4"></i>
              <h3 class="text-2xl font-bold text-blue-800">TrainingPeaks</h3>
            </div>
            <p class="text-gray-600 mb-6">Connect via OAuth for full read/write access</p>
            
            <div class="space-y-3 mb-6">
              <a href="/auth/trainingpeaks/coach" class="block bg-green-500 text-white text-center px-6 py-3 rounded-lg hover:bg-green-600 transition">
                <i class="fas fa-user-tie mr-2"></i>Connect as Coach
              </a>
              <a href="/auth/trainingpeaks/athlete" class="block bg-blue-500 text-white text-center px-6 py-3 rounded-lg hover:bg-blue-600 transition">
                <i class="fas fa-running mr-2"></i>Connect as Athlete
              </a>
            </div>
            
            <div class="text-sm text-gray-500">
              <p class="font-semibold mb-2">Features:</p>
              <ul class="space-y-1">
                <li>✓ Post workouts to calendar</li>
                <li>✓ Manage multiple athletes (coach)</li>
                <li>✓ Full event management</li>
                <li>✓ OAuth security</li>
              </ul>
            </div>
          </div>

          <!-- Intervals.icu -->
          <div class="border-2 border-purple-200 rounded-lg p-6 hover:border-purple-400 transition">
            <div class="flex items-center mb-4">
              <i class="fas fa-chart-line text-purple-500 text-4xl mr-4"></i>
              <h3 class="text-2xl font-bold text-purple-800">Intervals.icu</h3>
            </div>
            <p class="text-gray-600 mb-6">Connect with API key for instant access</p>
            
            <div class="mb-6">
              <input type="text" id="intervals-athlete-id" placeholder="Athlete ID (e.g., i12345)" 
                     class="w-full px-4 py-2 border rounded-lg mb-2">
              <input type="password" id="intervals-api-key" placeholder="API Key" 
                     class="w-full px-4 py-2 border rounded-lg mb-3">
              <button onclick="connectIntervals()" class="w-full bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition">
                <i class="fas fa-plug mr-2"></i>Connect Intervals.icu
              </button>
            </div>
            
            <div class="text-sm text-gray-500">
              <p class="font-semibold mb-2">Features:</p>
              <ul class="space-y-1">
                <li>✓ Direct API access</li>
                <li>✓ Real-time CTL/ATL/TSB</li>
                <li>✓ Wellness tracking</li>
                <li>✓ No OAuth required</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Features -->
      <div class="grid md:grid-cols-3 gap-6">
        <div class="bg-white p-6 rounded-lg shadow-md">
          <div class="text-blue-500 text-3xl mb-3"><i class="fas fa-brain"></i></div>
          <h3 class="text-xl font-bold mb-2">Angela's Intelligence</h3>
          <p class="text-gray-600">StressLogic v5.1 with 5-state classification</p>
        </div>
        
        <div class="bg-white p-6 rounded-lg shadow-md">
          <div class="text-green-500 text-3xl mb-3"><i class="fas fa-sync-alt"></i></div>
          <h3 class="text-xl font-bold mb-2">Multi-Platform</h3>
          <p class="text-gray-600">Works with TrainingPeaks AND Intervals.icu</p>
        </div>
        
        <div class="bg-white p-6 rounded-lg shadow-md">
          <div class="text-purple-500 text-3xl mb-3"><i class="fas fa-robot"></i></div>
          <h3 class="text-xl font-bold mb-2">GPT Integration</h3>
          <p class="text-gray-600">Custom ChatGPT actions for coaching</p>
        </div>
      </div>
    </main>
  </div>

  <script>
    async function connectIntervals() {
      const athleteId = document.getElementById('intervals-athlete-id').value
      const apiKey = document.getElementById('intervals-api-key').value
      
      if (!athleteId || !apiKey) {
        alert('Please enter both Athlete ID and API Key')
        return
      }
      
      try {
        const response = await fetch('/api/intervals/connect', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ athleteId, apiKey })
        })
        
        const data = await response.json()
        
        if (data.success) {
          alert(\`Connected! CTL: \${data.athlete.ctl}, ATL: \${data.athlete.atl}, TSB: \${data.athlete.tsb}\`)
          window.location.href = '/dashboard'
        } else {
          alert('Connection failed: ' + data.error)
        }
      } catch (error) {
        alert('Error: ' + error)
      }
    }
  </script>
</body>
</html>
  `)
})

export default app
