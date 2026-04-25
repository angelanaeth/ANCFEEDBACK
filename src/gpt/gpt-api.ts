/**
 * EchoDevo Coach GPT - API Integration
 * Implements endpoints for GPT to fetch/write TrainingPeaks data
 * Angela Coaching Engine v5.1 - TrainingPeaks Edition
 */

import { Context } from 'hono'

// Type definitions
type Bindings = {
  DB: D1Database
  TP_API_BASE_URL: string
  TP_CLIENT_ID: string
  TP_CLIENT_SECRET: string
}

interface Workout {
  date: string
  sport: string
  title: string
  description?: string
  duration: number
  distance?: number
  tss: number
  if?: number
  np?: number
  avg_power?: number
  avg_hr?: number
  avg_pace?: string
  elevation_gain?: number
  completed: boolean
  planned: boolean
}

interface Metrics {
  ctl: number
  atl: number
  tsb: number
  hrv?: number
  rhr?: number
  weight_kg?: number
  sleep_hours?: number
  sleep_quality?: number
  readiness_score?: number
}

interface Athlete {
  id: string
  name: string
  email: string
  sport: string
  ftp?: number
  cp?: number
  cs?: number
  lactate_threshold_hr?: number
  weight_kg?: number
  age?: number
}

interface AthleteDataResponse {
  athlete: Athlete
  metrics: Metrics
  workouts: Workout[]
  date_range: {
    start: string
    end: string
  }
}

/**
 * EWMA Calculation for CTL/ATL
 * CTL: tau = 42 days (long-term fitness)
 * ATL: tau = 7 days (short-term fatigue)
 */
function calculateEWMA(workouts: Array<{ date: string; tss: number }>, tau: number): number {
  if (workouts.length === 0) return 0

  // Filter out workouts with invalid dates and sort
  const validWorkouts = workouts.filter(w => {
    const time = new Date(w.date).getTime()
    return !isNaN(time) && time > 0
  })
  
  if (validWorkouts.length === 0) return 0

  const sorted = [...validWorkouts].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  
  let ewma = 0
  for (const workout of sorted) {
    ewma = ewma + (workout.tss - ewma) / tau
  }
  
  return Math.round(ewma * 10) / 10
}

/**
 * Calculate CTL/ATL/TSB from workout history
 */
export function calculateMetrics(workouts: Array<{ date: string; tss: number }>) {
  const ctl = calculateEWMA(workouts, 42)
  const atl = calculateEWMA(workouts, 7)
  const tsb = Math.round((ctl - atl) * 10) / 10

  return { ctl, atl, tsb }
}

/**
 * Normalize TrainingPeaks workout data to canonical format
 */
function normalizeWorkout(tpWorkout: any): Workout {
  // Map TrainingPeaks workout types to sport types
  const sportMap: Record<string, string> = {
    'bike': 'bike',
    'run': 'run',
    'swim': 'swim',
    'strength': 'strength',
    'other': 'other'
  }

  const sport = sportMap[tpWorkout.WorkoutType?.toLowerCase()] || 'other'
  
  // Safely parse date - handle invalid dates
  let workoutDate = tpWorkout.WorkoutDay || tpWorkout.Date
  if (!workoutDate || workoutDate === 'null' || workoutDate === '') {
    // Use today's date as fallback
    workoutDate = new Date().toISOString().split('T')[0]
  }
  
  return {
    date: workoutDate,
    sport: sport,
    title: tpWorkout.Title || `${sport} workout`,
    description: tpWorkout.Description || tpWorkout.Notes,
    duration: Math.round((tpWorkout.TotalTime || tpWorkout.Duration || 0) / 60), // seconds to minutes
    distance: tpWorkout.Distance ? tpWorkout.Distance / 1000 : undefined, // meters to km
    tss: tpWorkout.TSS || tpWorkout.TrainingStressScore || 0,
    if: tpWorkout.IntensityFactor || tpWorkout.IF,
    np: tpWorkout.NormalizedPower || tpWorkout.NP,
    avg_power: tpWorkout.AvgWatts || tpWorkout.AveragePower,
    avg_hr: tpWorkout.AvgHR || tpWorkout.AverageHeartRate,
    avg_pace: tpWorkout.AvgPace || tpWorkout.AveragePace,
    elevation_gain: tpWorkout.ElevationGain || tpWorkout.Elevation,
    completed: tpWorkout.IsCompleted || false,
    planned: tpWorkout.IsPlanned || false
  }
}

/**
 * Normalize athlete profile from TrainingPeaks
 */
function normalizeAthlete(tpAthlete: any): Athlete {
  return {
    id: String(tpAthlete.Id || tpAthlete.id),
    name: `${tpAthlete.FirstName || ''} ${tpAthlete.LastName || ''}`.trim() || 'Unknown Athlete',
    email: tpAthlete.Email || '',
    sport: 'triathlon', // Default - could be enhanced
    ftp: tpAthlete.FTP || undefined,
    cp: tpAthlete.CP || tpAthlete.CriticalPower || undefined,
    cs: tpAthlete.CS || tpAthlete.CriticalSpeed || undefined,
    lactate_threshold_hr: tpAthlete.LTHR || tpAthlete.LactateThresholdHR || undefined,
    weight_kg: tpAthlete.Weight || tpAthlete.weight_kg || undefined,
    age: tpAthlete.Age || undefined
  }
}

/**
 * GPT ENDPOINT: Fetch athlete data from TrainingPeaks
 * POST /api/gpt/fetch
 * 
 * Per-Athlete Context: If athlete_id matches the requested data, return it
 * Otherwise, reject with permission error
 */
export async function fetchAthleteData(c: Context<{ Bindings: Bindings }>) {
  const { DB, TP_API_BASE_URL } = c.env

  try {
    const body = await c.req.json()
    const { athlete_id, start_date, end_date, include_planned = false } = body
    
    // Check for athlete_id filter from query parameter (per-athlete GPT context)
    const athleteIdFilter = c.req.query('athlete_id')

    if (!athlete_id || !start_date || !end_date) {
      return c.json({ error: 'Missing required fields: athlete_id, start_date, end_date' }, 400)
    }
    
    // PER-ATHLETE FILTER: If athlete_id filter is set, only allow data for that athlete
    if (athleteIdFilter && athlete_id !== athleteIdFilter) {
      console.warn(`🚫 GPT Access Denied: Requesting athlete ${athlete_id} but context is ${athleteIdFilter}`)
      return c.json({ 
        error: `Access Denied: You are in a per-athlete GPT context for athlete ${athleteIdFilter}. Cannot access data for athlete ${athlete_id}.`,
        context_athlete_id: athleteIdFilter,
        requested_athlete_id: athlete_id
      }, 403)
    }

    console.log(`🔍 GPT Fetch Request: athlete=${athlete_id}, dates=${start_date} to ${end_date}${athleteIdFilter ? ` (FILTERED CONTEXT: ${athleteIdFilter})` : ''}`)

    // Get coach token from DB
    const coachResult = await DB.prepare(`
      SELECT access_token FROM users 
      WHERE account_type = 'coach' 
      ORDER BY created_at DESC 
      LIMIT 1
    `).first<{ access_token: string }>()

    if (!coachResult?.access_token) {
      return c.json({ error: 'No coach token found. Please connect TrainingPeaks first.' }, 401)
    }

    const token = coachResult.access_token

    // Fetch athlete profile - Try multiple endpoints
    let athleteProfile: any = null
    
    // Strategy 1: Try to get from local DB first (we synced 93 athletes)
    const localAthlete = await DB.prepare(`
      SELECT tp_athlete_id, name, email FROM users 
      WHERE tp_athlete_id = ? AND account_type = 'athlete'
    `).bind(athlete_id).first<any>()
    
    if (localAthlete) {
      console.log('✅ Using cached athlete profile from DB:', localAthlete.name)
      athleteProfile = {
        Id: localAthlete.tp_athlete_id,
        FirstName: localAthlete.name?.split(' ')[0] || 'Athlete',
        LastName: localAthlete.name?.split(' ').slice(1).join(' ') || athlete_id,
        Email: localAthlete.email || ''
      }
    } else {
      // Strategy 2: Try TrainingPeaks API endpoints
      console.log('🔍 Fetching athlete profile from TrainingPeaks API...')
      
      // Try coach/athlete endpoint first (coach viewing their athlete)
      try {
        const coachAthleteRes = await fetch(`${TP_API_BASE_URL}/v1/coach/athlete/${athlete_id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (coachAthleteRes.ok) {
          athleteProfile = await coachAthleteRes.json()
          console.log('✅ Got athlete via /coach/athlete endpoint')
        }
      } catch (e) {
        console.warn('⚠️ /coach/athlete endpoint failed, trying fallbacks')
      }
      
      // Fallback: Try getting from athletes list
      if (!athleteProfile) {
        try {
          const athletesRes = await fetch(`${TP_API_BASE_URL}/v1/coach/athletes`, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
          if (athletesRes.ok) {
            const athletes = await athletesRes.json()
            athleteProfile = athletes.find((a: any) => String(a.Id) === String(athlete_id))
            if (athleteProfile) {
              console.log('✅ Found athlete in athletes list')
            }
          }
        } catch (e) {
          console.warn('⚠️ /coach/athletes fallback also failed')
        }
      }
      
      // If still no profile, create minimal profile from athlete_id
      if (!athleteProfile) {
        console.warn('⚠️ Could not fetch athlete profile, using minimal data')
        athleteProfile = {
          Id: athlete_id,
          FirstName: 'Athlete',
          LastName: athlete_id,
          Email: ''
        }
      }
    }

    // Fetch workouts for date range - Try multiple endpoints
    let workouts: any[] = []
    console.log(`🔍 Fetching workouts for athlete ${athlete_id} from ${start_date} to ${end_date}`)
    
    try {
      // Try v1 endpoint first
      const workoutRes = await fetch(
        `${TP_API_BASE_URL}/v1/athlete/${athlete_id}/workouts?startDate=${start_date}&endDate=${end_date}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      )
      
      if (workoutRes.ok) {
        const data = await workoutRes.json()
        workouts = Array.isArray(data) ? data : (data.workouts || [])
        console.log(`✅ Fetched ${workouts.length} workouts from v1 endpoint`)
      } else {
        console.warn(`⚠️ v1 workouts endpoint returned ${workoutRes.status}, trying v2`)
        
        // Try v2 endpoint
        const workoutResV2 = await fetch(
          `${TP_API_BASE_URL}/v2/athlete/${athlete_id}/workouts?startDate=${start_date}&endDate=${end_date}`,
          { headers: { 'Authorization': `Bearer ${token}` } }
        )
        
        if (workoutResV2.ok) {
          const data = await workoutResV2.json()
          workouts = Array.isArray(data) ? data : (data.workouts || [])
          console.log(`✅ Fetched ${workouts.length} workouts from v2 endpoint`)
        } else {
          console.warn(`⚠️ v2 workouts endpoint also failed (${workoutResV2.status})`)
        }
      }
    } catch (error) {
      console.error('❌ Workout fetch error:', error)
      workouts = []
    }
    
    console.log(`📊 Total workouts retrieved: ${workouts.length}`)

    // CRITICAL: Load saved profile from athlete_profiles table
    // This ensures coach-saved values (CP, CS, Weight, etc.) persist
    let savedProfile: any = null
    try {
      savedProfile = await DB.prepare(`
        SELECT 
          ap.weight_kg,
          ap.cp_watts,
          ap.cs_run_seconds,
          ap.swim_pace_per_100m,
          ap.ftp_watts,
          ap.lactate_threshold_hr
        FROM users u
        LEFT JOIN athlete_profiles ap ON u.id = ap.user_id
        WHERE u.tp_athlete_id = ?
      `).bind(athlete_id).first<any>()
      
      if (savedProfile) {
        console.log('✅ Found saved profile in database for athlete', athlete_id)
        // Override TrainingPeaks values with saved values
        if (savedProfile.weight_kg) athleteProfile.Weight = savedProfile.weight_kg
        if (savedProfile.cp_watts) athleteProfile.CP = savedProfile.cp_watts
        if (savedProfile.cs_run_seconds) athleteProfile.CS = savedProfile.cs_run_seconds
        if (savedProfile.swim_pace_per_100m) athleteProfile.SwimPace = savedProfile.swim_pace_per_100m
        if (savedProfile.ftp_watts) athleteProfile.FTP = savedProfile.ftp_watts
        if (savedProfile.lactate_threshold_hr) athleteProfile.LTHR = savedProfile.lactate_threshold_hr
      } else {
        console.log('⚠️ No saved profile found, using TrainingPeaks values')
      }
    } catch (error) {
      console.warn('⚠️ Error loading saved profile:', error)
    }

    // Normalize athlete data
    let athlete: Athlete
    try {
      athlete = normalizeAthlete(athleteProfile)
      console.log(`✅ Athlete normalized: ${athlete.name}`)
    } catch (error) {
      console.error('❌ Error normalizing athlete:', error)
      return c.json({ error: 'Failed to normalize athlete data' }, 500)
    }

    // Normalize workouts
    let normalizedWorkouts: Workout[] = []
    try {
      normalizedWorkouts = workouts.map(normalizeWorkout)
      console.log(`✅ Normalized ${normalizedWorkouts.length} workouts`)
    } catch (error) {
      console.error('❌ Error normalizing workouts:', error)
      // Continue with empty workouts rather than failing
      normalizedWorkouts = []
    }

    // Calculate CTL/ATL/TSB from workout history
    let calculatedMetrics: { ctl: number, atl: number, tsb: number }
    try {
      const workoutHistory = normalizedWorkouts
        .filter(w => w.completed && w.tss > 0)
        .map(w => ({ date: w.date, tss: w.tss }))
      
      calculatedMetrics = calculateMetrics(workoutHistory)
      console.log(`✅ Metrics calculated: CTL=${calculatedMetrics.ctl}, ATL=${calculatedMetrics.atl}, TSB=${calculatedMetrics.tsb}`)
    } catch (error) {
      console.error('❌ Error calculating metrics:', error)
      calculatedMetrics = { ctl: 0, atl: 0, tsb: 0 }
    }

    // Try to get wellness data from DB (if stored)
    let wellnessData: any = null
    try {
      wellnessData = await DB.prepare(`
        SELECT hrv, rhr, sleep_hours, sleep_quality, readiness_score
        FROM wellness_data
        WHERE user_id = (SELECT id FROM users WHERE tp_athlete_id = ?)
        ORDER BY date DESC
        LIMIT 1
      `).bind(athlete_id).first<any>()
    } catch (error) {
      console.warn('⚠️ No wellness data found:', error)
      wellnessData = null
    }

    const metrics: Metrics = {
      ctl: calculatedMetrics.ctl,
      atl: calculatedMetrics.atl,
      tsb: calculatedMetrics.tsb,
      hrv: wellnessData?.hrv || undefined,
      rhr: wellnessData?.rhr || undefined,
      sleep_hours: wellnessData?.sleep_hours || undefined,
      sleep_quality: wellnessData?.sleep_quality || undefined,
      readiness_score: wellnessData?.readiness_score || undefined
    }

    const response: AthleteDataResponse = {
      athlete,
      metrics,
      workouts: normalizedWorkouts,
      date_range: {
        start: start_date,
        end: end_date
      }
    }

    console.log('✅ GPT Fetch Success:', {
      athlete: athlete.name,
      workouts: normalizedWorkouts.length,
      ctl: metrics.ctl,
      atl: metrics.atl,
      tsb: metrics.tsb,
      filtered_context: athleteIdFilter ? `Yes (athlete ${athleteIdFilter})` : 'No (all athletes)'
    })

    return c.json(response)

  } catch (error: any) {
    console.error('❌ GPT Fetch Error:', error)
    return c.json({ error: error.message || 'Internal server error' }, 500)
  }
}

/**
 * GPT ENDPOINT: Write workout plan to TrainingPeaks
 * POST /api/gpt/write
 * 
 * Per-Athlete Context: If athlete_id filter is set, only allow writing to that athlete
 */
export async function writeWorkoutPlan(c: Context<{ Bindings: Bindings }>) {
  const { DB, TP_API_BASE_URL } = c.env

  try {
    const body = await c.req.json()
    const { athlete_id, workouts } = body
    
    // Check for athlete_id filter from query parameter (per-athlete GPT context)
    const athleteIdFilter = c.req.query('athlete_id')

    if (!athlete_id || !workouts || !Array.isArray(workouts)) {
      return c.json({ error: 'Missing required fields: athlete_id, workouts' }, 400)
    }
    
    // PER-ATHLETE FILTER: If athlete_id filter is set, only allow writing to that athlete
    if (athleteIdFilter && athlete_id !== athleteIdFilter) {
      console.warn(`🚫 GPT Write Denied: Trying to write to athlete ${athlete_id} but context is ${athleteIdFilter}`)
      return c.json({ 
        error: `Access Denied: You are in a per-athlete GPT context for athlete ${athleteIdFilter}. Cannot write workouts for athlete ${athlete_id}.`,
        context_athlete_id: athleteIdFilter,
        requested_athlete_id: athlete_id
      }, 403)
    }

    console.log(`📝 GPT Write Request: athlete=${athlete_id}, workouts=${workouts.length}${athleteIdFilter ? ` (FILTERED CONTEXT: ${athleteIdFilter})` : ''}`)

    // Get coach token
    const coachResult = await DB.prepare(`
      SELECT access_token FROM users 
      WHERE account_type = 'coach' 
      ORDER BY created_at DESC 
      LIMIT 1
    `).first<{ access_token: string }>()

    if (!coachResult?.access_token) {
      return c.json({ error: 'No coach token found' }, 401)
    }

    const token = coachResult.access_token
    const createdWorkouts: string[] = []

    // Post each workout to TrainingPeaks
    for (const workout of workouts) {
      try {
        const tpWorkout = {
          WorkoutDay: workout.date,
          WorkoutType: workout.sport,
          Title: workout.title,
          Description: workout.description || '',
          TotalTime: workout.duration * 60, // minutes to seconds
          TSS: workout.tss,
          Structure: workout.description || '',
          CoachComments: workout.coach_notes || ''
        }

        const res = await fetch(`${TP_API_BASE_URL}/v1/athlete/${athlete_id}/workouts`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(tpWorkout)
        })

        if (res.ok) {
          const created = await res.json()
          createdWorkouts.push(created.Id || created.id)
          console.log('✅ Workout created:', workout.title)
        } else {
          console.error('❌ Failed to create workout:', workout.title, await res.text())
        }
      } catch (error) {
        console.error('❌ Workout creation error:', error)
      }
    }

    return c.json({
      status: 'success',
      workouts_created: createdWorkouts.length,
      workout_ids: createdWorkouts,
      context_athlete_id: athleteIdFilter || 'all_athletes'
    })

  } catch (error: any) {
    console.error('❌ GPT Write Error:', error)
    return c.json({ error: error.message || 'Internal server error' }, 500)
  }
}

/**
 * GPT ENDPOINT: List all athletes (Coach Mode)
 * GET /api/gpt/athletes?athlete_id={id}
 * 
 * If athlete_id is provided, ONLY return that athlete (per-athlete GPT context)
 * If no athlete_id, return all athletes (multi-athlete GPT context)
 */
export async function listAthletes(c: Context<{ Bindings: Bindings }>) {
  const { DB, TP_API_BASE_URL } = c.env

  try {
    // Check for athlete_id filter parameter
    const athleteIdFilter = c.req.query('athlete_id')
    
    if (athleteIdFilter) {
      console.log(`👤 GPT Athletes List Request (FILTERED for athlete: ${athleteIdFilter})`)
    } else {
      console.log('👥 GPT Athletes List Request (ALL athletes)')
    }

    // Get coach token
    const coachResult = await DB.prepare(`
      SELECT access_token FROM users 
      WHERE account_type = 'coach' 
      ORDER BY created_at DESC 
      LIMIT 1
    `).first<{ access_token: string }>()

    if (!coachResult?.access_token) {
      return c.json({ error: 'Not authorized as coach' }, 401)
    }

    const token = coachResult.access_token

    // Fetch athletes from TrainingPeaks
    let athletes: any[] = []
    try {
      const res = await fetch(`${TP_API_BASE_URL}/v1/coach/athletes`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (res.ok) {
        athletes = await res.json()
      } else {
        // Fallback to v2
        const resV2 = await fetch(`${TP_API_BASE_URL}/v2/coach/athletes`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (resV2.ok) {
          athletes = await resV2.json()
        }
      }
    } catch (error) {
      console.error('❌ Failed to fetch athletes:', error)
    }

    // Filter athletes if athlete_id is provided
    if (athleteIdFilter) {
      athletes = athletes.filter(a => String(a.Id || a.id) === athleteIdFilter)
      console.log(`🔍 Filtered to ${athletes.length} athlete(s) matching ID: ${athleteIdFilter}`)
    }

    // Get current metrics from DB for each athlete
    const athleteSummaries = await Promise.all(
      athletes.map(async (tpAthlete) => {
        const athleteId = String(tpAthlete.Id || tpAthlete.id)
        
        // Get latest metrics from DB
        const metricsResult = await DB.prepare(`
          SELECT ctl, atl, tsb, block_type, date as last_workout
          FROM training_metrics
          WHERE user_id = (SELECT id FROM users WHERE tp_athlete_id = ?)
          ORDER BY date DESC
          LIMIT 1
        `).bind(athleteId).first<any>()

        return {
          id: athleteId,
          name: `${tpAthlete.FirstName || ''} ${tpAthlete.LastName || ''}`.trim(),
          email: tpAthlete.Email || '',
          sport: 'triathlon',
          current_ctl: metricsResult?.ctl || null,
          current_atl: metricsResult?.atl || null,
          current_tsb: metricsResult?.tsb || null,
          last_workout: metricsResult?.last_workout || null,
          current_block: metricsResult?.block_type || null
        }
      })
    )

    console.log(`✅ GPT Athletes List Success: ${athleteSummaries.length} athlete(s)`)

    // If filtering for single athlete and found, return athlete context message
    const response: any = {
      athletes: athleteSummaries,
      total: athleteSummaries.length
    }
    
    if (athleteIdFilter && athleteSummaries.length === 1) {
      response.context = `GPT Context: You are discussing ONLY athlete ${athleteSummaries[0].name} (ID: ${athleteSummaries[0].id}). Do not mention or reference data from other athletes.`
      response.athlete_filter = athleteIdFilter
    } else if (athleteIdFilter && athleteSummaries.length === 0) {
      response.warning = `No athlete found with ID: ${athleteIdFilter}`
    }

    return c.json(response)

  } catch (error: any) {
    console.error('❌ GPT Athletes List Error:', error)
    return c.json({ error: error.message || 'Internal server error' }, 500)
  }
}

/**
 * GPT ENDPOINT: Calculate metrics from workout history
 * POST /api/gpt/metrics/calculate
 */
export async function calculateMetricsEndpoint(c: Context<{ Bindings: Bindings }>) {
  try {
    const body = await c.req.json()
    const { athlete_id, workouts } = body

    if (!athlete_id || !workouts || !Array.isArray(workouts)) {
      return c.json({ error: 'Missing required fields: athlete_id, workouts' }, 400)
    }

    console.log('🧮 GPT Metrics Calculation:', { athlete_id, workout_count: workouts.length })

    // Calculate CTL/ATL/TSB
    const metrics = calculateMetrics(workouts)
    const calculated_date = new Date().toISOString().split('T')[0]

    console.log('✅ Metrics calculated:', metrics)

    return c.json({
      ...metrics,
      calculated_date
    })

  } catch (error: any) {
    console.error('❌ GPT Metrics Calculation Error:', error)
    return c.json({ error: error.message || 'Internal server error' }, 500)
  }
}
