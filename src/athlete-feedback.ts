/**
 * ANC Athlete Feedback Module
 * Generates coach-edited athlete feedback notes in Angela's voice
 * Uses: TrainingPeaks data + Analysis Engine + Claude AI
 * 
 * Integrates with existing:
 *  - D1 database (users, training_metrics, athlete_notes tables)
 *  - TrainingPeaks API (coach token from DB, auto-refreshes)
 *  - Anthropic Claude API for draft generation
 */

import { Context } from 'hono'

// ============================================================================
// TYPES
// ============================================================================

type Bindings = {
  DB: D1Database
  TP_API_BASE_URL: string
  TP_CLIENT_ID: string
  TP_CLIENT_SECRET: string
  TP_TOKEN_URL: string
  ANTHROPIC_API_KEY: string
}

interface FeedbackRequest {
  athlete_id: string
  date_range: 'this_week' | 'last_week' | 'last_3_days' | 'custom'
  start_date?: string
  end_date?: string
  block_override?: string
  coach_prompt?: string
  sport_focus?: 'bike' | 'run' | 'swim' | 'all'
}

interface DetectedBlock {
  block: string
  confidence: 'high' | 'medium' | 'low'
  source_titles: string[]
  is_rebuild: boolean
}

interface NormalizedWorkout {
  date: string
  title: string
  sport: string
  tss: number
  duration_minutes: number
  distance_km: number
  avg_power: number | null
  avg_hr: number | null
  avg_pace: string | null
  np: number | null
  intensity_factor: number | null
  elevation_gain: number | null
  athlete_notes: string | null
  coach_notes: string | null
  completed: boolean
  planned: boolean
}

interface KeyWorkout {
  date: string
  title: string
  sport: string
  tss: number
  duration_minutes: number
  distance_km: number
  avg_power: number | null
  avg_hr: number | null
  avg_pace: string | null
  np: number | null
  intensity_factor: number | null
  athlete_notes: string | null
  execution_summary: string
}

interface FitnessTrend {
  sport: string
  ctl_current: number
  atl_current: number
  tsb_current: number
  ctl_4wk_ago: number
  ctl_change: number
  ctl_direction: 'building' | 'stable' | 'declining'
  atl_trend: string
}

interface FeedbackDraft {
  draft: string
  detected_block: DetectedBlock
  key_workouts: KeyWorkout[]
  fitness_trends: FitnessTrend[]
  athlete_comments: string[]
  stress_state: string
  word_count: number
  generated_at: string
  raw_workout_count: number
  completed_workout_count: number
}

// ============================================================================
// TOKEN REFRESH HELPER
// ============================================================================

async function getValidCoachToken(c: Context<{ Bindings: Bindings }>): Promise<string | null> {
  const { DB } = c.env

  const coachRow = await DB.prepare(`
    SELECT access_token, refresh_token, token_expires_at FROM users
    WHERE account_type = 'coach'
    ORDER BY created_at DESC LIMIT 1
  `).first<{ access_token: string; refresh_token: string; token_expires_at: number }>()

  if (!coachRow?.access_token) return null

  let token = coachRow.access_token
  const nowSec = Math.floor(Date.now() / 1000)

  // If token expires within 5 minutes, refresh it
  if (coachRow.token_expires_at && coachRow.token_expires_at < (nowSec + 300) && coachRow.refresh_token) {
    console.log('Token expired or expiring soon, refreshing...')
    try {
      const refreshRes = await fetch(c.env.TP_TOKEN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: coachRow.refresh_token,
          client_id: c.env.TP_CLIENT_ID,
          client_secret: c.env.TP_CLIENT_SECRET,
        }).toString()
      })
      if (refreshRes.ok) {
        const newTokens = await refreshRes.json() as any
        if (newTokens.access_token) {
          token = newTokens.access_token
          await DB.prepare(`
            UPDATE users SET access_token = ?, refresh_token = ?, token_expires_at = ?, updated_at = datetime('now')
            WHERE account_type = 'coach' ORDER BY created_at DESC LIMIT 1
          `).bind(
            newTokens.access_token,
            newTokens.refresh_token || coachRow.refresh_token,
            nowSec + (newTokens.expires_in || 3600)
          ).run()
          console.log('Token refreshed successfully')
        }
      } else {
        console.error('Token refresh failed:', refreshRes.status, await refreshRes.text())
      }
    } catch (e) {
      console.error('Token refresh error:', e)
    }
  }

  return token
}

// ============================================================================
// WORKOUT NORMALIZATION (matches TrainingPeaks field names)
// ============================================================================

function normalizeTPWorkout(w: any): NormalizedWorkout {
  const sport = (w.WorkoutType || w.workoutType || w.sport || 'other').toLowerCase()
  const totalTimeSeconds = w.TotalTime || w.Duration || w.totalTime || 0
  const tss = w.TSS || w.TrainingStressScore || w.tss || 0
  const distance = w.Distance || w.distance || 0

  return {
    date: w.WorkoutDay || w.Date || w.date || '',
    title: w.Title || w.title || `${sport} workout`,
    sport: sport,
    tss: Math.round(tss),
    duration_minutes: Math.round(totalTimeSeconds / 60),
    distance_km: distance > 0 ? Math.round((distance / 1000) * 100) / 100 : 0,
    avg_power: w.AvgWatts || w.AveragePower || w.avgWatts || null,
    avg_hr: w.AvgHR || w.AverageHeartRate || w.avgHR || null,
    avg_pace: w.AvgPace || w.AveragePace || w.avgPace || null,
    np: w.NormalizedPower || w.NP || w.normalizedPower || null,
    intensity_factor: w.IntensityFactor || w.IF || w.intensityFactor || null,
    elevation_gain: w.ElevationGain || w.Elevation || w.elevationGain || null,
    athlete_notes: w.AthleteNotes || w.athleteNotes || null,
    coach_notes: w.CoachComments || w.Description || w.Notes || w.coachComments || null,
    completed: w.IsCompleted || w.isCompleted || w.completed || false,
    planned: w.IsPlanned || w.isPlanned || w.planned || false,
  }
}

// ============================================================================
// BLOCK DETECTION
// ============================================================================

const BLOCK_PATTERNS: Record<string, RegExp[]> = {
  'Base/Durability': [
    /\bBD\b/i, /\bbase\b/i, /\bdurability\b/i,
    /\bZ[12]\s*(run|ride|bike)/i, /\bZR\b/i,
    /\baerobic\s*(run|ride|bike)/i, /\beasy\s*(run|ride|bike)/i,
  ],
  'Build/Threshold': [
    /\bBTH\b/i, /\bbuild\b/i, /\bthreshold\b/i,
    /\bZ3\b/i, /\bFTP\b/i, /\bSST\b/i,
    /\bsweet\s*spot/i, /\btempo\b/i,
  ],
  'Aerobic Expansion': [
    /\bAE\b/i, /\baerobic\s*expansion/i, /\bsub[- ]?LT1/i,
  ],
  'VO2 Max': [
    /\bVO2\b/i, /\bZ5\b/i,
    /\bintervals?\b.*\b(3|4|5)\s*min/i, /\b110\s*%/i,
  ],
  'Specificity': [
    /\bSP\b/i, /\bspec\b/i, /\brace\s*pace/i,
    /\brick\b/i, /\bsimulation/i,
  ],
  'Rebuild': [
    /\brebuild\b/i, /\brecovery\s*block/i, /\breset\b/i,
  ],
}

export function detectBlock(workoutTitles: string[], hasRecentRace: boolean): DetectedBlock {
  const votes: Record<string, number> = {}
  const matchedTitles: Record<string, string[]> = {}

  for (const title of workoutTitles) {
    for (const [block, patterns] of Object.entries(BLOCK_PATTERNS)) {
      for (const pattern of patterns) {
        if (pattern.test(title)) {
          votes[block] = (votes[block] || 0) + 1
          if (!matchedTitles[block]) matchedTitles[block] = []
          if (!matchedTitles[block].includes(title)) {
            matchedTitles[block].push(title)
          }
        }
      }
    }
  }

  let topBlock = 'Unknown'
  let topVotes = 0
  for (const [block, count] of Object.entries(votes)) {
    if (count > topVotes) { topBlock = block; topVotes = count }
  }

  const totalWorkouts = workoutTitles.length
  let confidence: 'high' | 'medium' | 'low' = 'low'
  if (totalWorkouts > 0) {
    const ratio = topVotes / totalWorkouts
    if (ratio >= 0.5) confidence = 'high'
    else if (ratio >= 0.25) confidence = 'medium'
  }

  const isRebuild = hasRecentRace && (topBlock === 'Base/Durability' || topBlock === 'Rebuild')
  if (isRebuild) { topBlock = 'Rebuild'; confidence = 'medium' }

  return { block: topBlock, confidence, source_titles: matchedTitles[topBlock] || [], is_rebuild: isRebuild }
}

// ============================================================================
// WORKOUT SELECTION & EXECUTION SUMMARY
// ============================================================================

function buildExecutionSummary(w: NormalizedWorkout): string {
  const parts: string[] = []
  if (w.tss > 0) parts.push(`TSS ${w.tss}`)
  if (w.duration_minutes > 0) parts.push(`${w.duration_minutes}min`)
  if (w.distance_km > 0) parts.push(`${w.distance_km}km`)
  if (w.avg_power) parts.push(`avg ${w.avg_power}W`)
  if (w.np) parts.push(`NP ${w.np}W`)
  if (w.intensity_factor) parts.push(`IF ${w.intensity_factor}`)
  if (w.avg_hr) parts.push(`avg HR ${w.avg_hr}`)
  if (w.avg_pace) parts.push(`pace ${w.avg_pace}`)
  if (w.elevation_gain) parts.push(`${w.elevation_gain}m gain`)
  return parts.join(', ') || 'no data'
}

function selectKeyWorkouts(workouts: NormalizedWorkout[], maxCount: number = 3): KeyWorkout[] {
  if (!workouts || workouts.length === 0) return []

  const scored = workouts
    .filter(w => w.completed || w.tss > 0 || w.duration_minutes > 0)
    .map(w => {
      let score = 0
      if (w.tss > 0) score += Math.min(w.tss / 20, 5)
      if (w.duration_minutes > 0) score += Math.min(w.duration_minutes / 30, 3)
      if (w.athlete_notes && w.athlete_notes.length > 5) score += 3
      if (/threshold|tempo|interval|VO2|race|test|brick|long/i.test(w.title)) score += 2
      if (/recovery|easy|ZR|rest/i.test(w.title)) score -= 2
      if (w.avg_power || w.np) score += 1
      return { ...w, _score: score }
    })
    .sort((a, b) => b._score - a._score)
    .slice(0, maxCount)

  return scored.map(({ _score, ...w }) => ({
    date: w.date,
    title: w.title,
    sport: w.sport,
    tss: w.tss,
    duration_minutes: w.duration_minutes,
    distance_km: w.distance_km,
    avg_power: w.avg_power,
    avg_hr: w.avg_hr,
    avg_pace: w.avg_pace,
    np: w.np,
    intensity_factor: w.intensity_factor,
    athlete_notes: w.athlete_notes,
    execution_summary: buildExecutionSummary(w),
  }))
}

// ============================================================================
// CTL/ATL/TSB CALCULATION (from workout data directly)
// ============================================================================

function calculateEWMA(workouts: Array<{ date: string; tss: number }>, tau: number): number {
  if (workouts.length === 0) return 0
  const valid = workouts.filter(w => {
    const t = new Date(w.date).getTime()
    return !isNaN(t) && t > 0 && w.tss > 0
  })
  if (valid.length === 0) return 0
  const sorted = [...valid].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  let ewma = 0
  for (const w of sorted) { ewma = ewma + (w.tss - ewma) / tau }
  return Math.round(ewma * 10) / 10
}

function calculateFitnessTrend(
  allWorkouts: NormalizedWorkout[],
  recentWorkouts: NormalizedWorkout[],
  sport: string
): FitnessTrend {
  const toTSS = (ws: NormalizedWorkout[]) => ws.filter(w => w.tss > 0).map(w => ({ date: w.date, tss: w.tss }))

  const allTSS = toTSS(allWorkouts)

  const ctlCurrent = calculateEWMA(allTSS, 42)
  const atlCurrent = calculateEWMA(allTSS, 7)
  const tsbCurrent = Math.round((ctlCurrent - atlCurrent) * 10) / 10

  const fourWeeksAgo = new Date()
  fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28)
  const olderTSS = allTSS.filter(w => new Date(w.date) <= fourWeeksAgo)
  const ctl4wkAgo = calculateEWMA(olderTSS, 42)
  const ctlChange = Math.round((ctlCurrent - ctl4wkAgo) * 10) / 10

  let ctlDirection: 'building' | 'stable' | 'declining' = 'stable'
  if (ctlChange > 3) ctlDirection = 'building'
  else if (ctlChange < -3) ctlDirection = 'declining'

  const twoWeeksAgo = new Date()
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14)
  const olderForATL = allTSS.filter(w => new Date(w.date) <= twoWeeksAgo)
  const atl2wkAgo = calculateEWMA(olderForATL, 7)
  let atlTrend = 'stable'
  if (atlCurrent - atl2wkAgo > 10) atlTrend = 'elevated'
  else if (atlCurrent - atl2wkAgo < -10) atlTrend = 'dropping'

  return {
    sport,
    ctl_current: ctlCurrent,
    atl_current: atlCurrent,
    tsb_current: tsbCurrent,
    ctl_4wk_ago: ctl4wkAgo,
    ctl_change: ctlChange,
    ctl_direction: ctlDirection,
    atl_trend: atlTrend,
  }
}

// ============================================================================
// CLAUDE DRAFT GENERATION (Angela's Corrected Voice)
// ============================================================================

function buildAngelaPrompt(
  athleteName: string,
  block: DetectedBlock,
  keyWorkouts: KeyWorkout[],
  fitnessTrends: FitnessTrend[],
  athleteComments: string[],
  stressState: string,
  allWorkouts: NormalizedWorkout[],
  raceContext: string | null,
  coachPrompt: string | null
): string {
  const workoutDetails = keyWorkouts.map(w => {
    let detail = `- ${w.date}: "${w.title}" (${w.sport}) -- ${w.execution_summary}`
    if (w.athlete_notes) detail += `\n  Athlete said: "${w.athlete_notes}"`
    return detail
  }).join('\n')

  const completedCount = allWorkouts.filter(w => w.completed || w.tss > 0).length
  const totalTSS = allWorkouts.reduce((sum, w) => sum + w.tss, 0)
  const totalDuration = allWorkouts.reduce((sum, w) => sum + w.duration_minutes, 0)
  const weekSummary = `${completedCount} workouts completed, total TSS ${totalTSS}, total duration ${totalDuration}min`

  const trendDetails = fitnessTrends.map(t => {
    return `${t.sport.toUpperCase()}: CTL ${t.ctl_current} (was ${t.ctl_4wk_ago} four weeks ago, ${t.ctl_direction} ${t.ctl_change > 0 ? '+' : ''}${t.ctl_change}), ATL ${t.atl_current} (${t.atl_trend}), TSB ${t.tsb_current}`
  }).join('\n')

  const commentsSection = athleteComments.length > 0
    ? `ATHLETE'S OWN COMMENTS THIS WEEK:\n${athleteComments.map(c => `- "${c}"`).join('\n')}`
    : 'No athlete comments this week.'

  const systemPrompt = `You are Angela Naeth, an endurance coaching expert who coaches athletes in cycling, running, and triathlon using metabolic curve physiology and the StressLogic framework.

Your voice is:
- Direct and factual (not flowery or generic)
- Data-driven (reference real metrics, zones, compliance)
- Specific (actual workouts, not abstract "training")
- Human (acknowledge effort, read their comments)
- Practical (actionable coaching, not inspiration)
- Technical but accessible (metabolic terms + plain language)

TONE EXAMPLES:

GOOD (Angela's voice):
"Your Tuesday run hit Z1 targets consistently--power stable, no zone creep. Saturday's long run showed good aerobic efficiency despite fatigue. Run CTL is steady at 285, up 3 points from 4 weeks ago. That's healthy adaptation. You mentioned feeling strong early week--that execution supports the data. Keep the discipline on easy days."

BAD (Don't write like this):
"Your base block consistency is showing up in the work this week. The kind of execution that builds metabolic flexibility pays dividends. Trust the process--this base work matters."

KEY RULES:

1. USE REAL DATA ONLY
   - Reference actual TSS, CTL, ATL, TSB values
   - Cite specific workouts by name + performance (watts, HR, pace, duration, distance)
   - Show 4-week trends with numbers
   - If data missing, say so clearly, don't hedge or make it up

2. REFERENCE THEIR COMMENTS
   - If they said something, acknowledge it directly
   - "You mentioned..." not "athletes typically..."

3. ZONE & METABOLIC LANGUAGE
   - Use zone classification (Z1, Z2, Z3, W')
   - Mention LT1, OGC, CP when relevant
   - "Zone creep" when easy work too hard
   - "Aerobic efficiency" when good Z1 execution

4. STRUCTURE (natural, not rigid):
   - Opening: What they accomplished this week (with numbers)
   - Specific workouts: 1-3 key sessions with real data
   - Fitness picture: CTL/ATL/TSB 4-week trend with actual values
   - Their comment: Reference what they said
   - Coaching action: What to maintain or adjust
   - Closing: Honest assessment (not motivational platitudes)

5. LENGTH: 150-250 words. Every sentence earns its place. Cut generic phrases.

6. HONESTY: Celebrate execution. Call out zone creep or missed targets. Don't sugarcoat.

7. BLOCK-SPECIFIC LANGUAGE:
   - Base: "Durability," "aerobic foundation," "consistency"
   - Build/Threshold: "Threshold stress," "lactate tolerance," "CP work"
   - VO2 Max: "Aerobic ceiling," "roof work," "maximal efforts"
   - Specificity: "Race pace," "race demands," "execution"

ANGELA'S WORD CHOICES: "Dialed" "Controlled" "Holding steady" "Zone creep" "Aerobic efficiency" "You showed" "Keep the discipline" "That's healthy"

NEVER:
- Generic motivation ("trust the process," "you've got this," "keep up the good work")
- "Productive stress state" or similar jargon without meaning
- Repeat the same idea multiple times
- Flowery language or exclamation marks
- Ignore missing data (state it clearly)
- Make up metrics that weren't provided`

  const userPrompt = `Write a weekly feedback note for ${athleteName}.

CURRENT BLOCK: ${block.block} (confidence: ${block.confidence})
STRESS STATE: ${stressState}
${raceContext ? `RACE CONTEXT: ${raceContext}` : ''}

WEEK SUMMARY: ${weekSummary}

KEY WORKOUTS THIS WEEK (with real data):
${workoutDetails || 'No completed workout data available -- say so directly.'}

FITNESS METRICS:
${trendDetails || 'Limited trend data -- new athlete or insufficient history. Say so directly.'}

${commentsSection}

${coachPrompt ? `COACH'S SPECIFIC INSTRUCTION: ${coachPrompt}` : ''}

Generate a 150-250 word athlete feedback note in Angela's voice. Use the actual data provided. Reference specific workouts with their real numbers. Acknowledge athlete comments. Be direct and honest. No generic phrases. Make every word count.`

  return JSON.stringify([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ])
}

async function generateDraftWithClaude(
  apiKey: string,
  messages: string
): Promise<string> {
  const parsed = JSON.parse(messages)
  const systemMsg = parsed.find((m: any) => m.role === 'system')?.content || ''
  const userMsg = parsed.find((m: any) => m.role === 'user')?.content || ''

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: systemMsg,
      messages: [{ role: 'user', content: userMsg }],
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Claude API error ${response.status}: ${errorText}`)
  }

  const data = await response.json() as any
  return data.content?.[0]?.text || 'Error generating draft.'
}

// ============================================================================
// MAIN API HANDLERS
// ============================================================================

export async function generateFeedback(c: Context<{ Bindings: Bindings }>) {
  const { DB, TP_API_BASE_URL, ANTHROPIC_API_KEY } = c.env

  try {
    const body: FeedbackRequest = await c.req.json()
    const { athlete_id, date_range, block_override, coach_prompt, sport_focus } = body

    if (!athlete_id) {
      return c.json({ error: 'athlete_id is required' }, 400)
    }

    // 1. Resolve date range
    const now = new Date()
    let startDate: string
    let endDate: string = now.toISOString().split('T')[0]

    switch (date_range) {
      case 'this_week': {
        const monday = new Date(now)
        monday.setDate(now.getDate() - now.getDay() + (now.getDay() === 0 ? -6 : 1))
        startDate = monday.toISOString().split('T')[0]
        break
      }
      case 'last_week': {
        const lastMonday = new Date(now)
        lastMonday.setDate(now.getDate() - now.getDay() - 6)
        const lastSunday = new Date(lastMonday)
        lastSunday.setDate(lastMonday.getDate() + 6)
        startDate = lastMonday.toISOString().split('T')[0]
        endDate = lastSunday.toISOString().split('T')[0]
        break
      }
      case 'last_3_days': {
        const threeDaysAgo = new Date(now)
        threeDaysAgo.setDate(now.getDate() - 3)
        startDate = threeDaysAgo.toISOString().split('T')[0]
        break
      }
      case 'custom': {
        startDate = body.start_date || endDate
        endDate = body.end_date || endDate
        break
      }
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }

    // 2. Get coach token (with auto-refresh)
    const token = await getValidCoachToken(c)
    if (!token) {
      return c.json({ error: 'No valid coach token. Please re-authenticate with TrainingPeaks.' }, 401)
    }

    // 3. Fetch THIS WEEK's workouts from TrainingPeaks
    let rawWorkouts: any[] = []
    try {
      const res = await fetch(
        `${TP_API_BASE_URL}/v1/athlete/${athlete_id}/workouts?startDate=${startDate}&endDate=${endDate}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      )
      if (res.ok) {
        rawWorkouts = await res.json() as any[]
      } else {
        console.log('v1 workouts failed with', res.status, '- trying v2')
        const res2 = await fetch(
          `${TP_API_BASE_URL}/v2/athlete/${athlete_id}/workouts?startDate=${startDate}&endDate=${endDate}`,
          { headers: { 'Authorization': `Bearer ${token}` } }
        )
        if (res2.ok) { rawWorkouts = await res2.json() as any[] }
        else { console.error('v2 workouts also failed:', res2.status) }
      }
    } catch (e) {
      console.error('Failed to fetch workouts:', e)
    }

    console.log(`Fetched ${rawWorkouts.length} raw workouts for ${startDate} to ${endDate}`)

    // 4. Fetch HISTORICAL workouts (90 days) for CTL/ATL/TSB calculation
    let historicalRaw: any[] = []
    try {
      const histStart = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      const histRes = await fetch(
        `${TP_API_BASE_URL}/v1/athlete/${athlete_id}/workouts?startDate=${histStart}&endDate=${endDate}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      )
      if (histRes.ok) {
        historicalRaw = await histRes.json() as any[]
        console.log(`Fetched ${historicalRaw.length} historical workouts for CTL/ATL/TSB`)
      }
    } catch (e) {
      console.error('Failed to fetch historical workouts:', e)
    }

    // 5. Normalize all workouts
    let weekWorkouts = rawWorkouts.map(normalizeTPWorkout)
    const historicalWorkouts = historicalRaw.map(normalizeTPWorkout)

    // Filter by sport if specified
    if (sport_focus && sport_focus !== 'all') {
      weekWorkouts = weekWorkouts.filter(w => w.sport === sport_focus)
    }

    // 6. Get athlete name
    const athleteUser = await DB.prepare(`
      SELECT name FROM users WHERE tp_athlete_id = ?
    `).bind(athlete_id).first<{ name: string }>()
    const athleteName = athleteUser?.name || `Athlete ${athlete_id}`

    // 7. Block detection
    const titles = weekWorkouts.map(w => w.title).filter(Boolean)
    let hasRecentRace = false
    try {
      const raceCheck = await fetch(
        `${TP_API_BASE_URL}/v1/athlete/${athlete_id}/events?startDate=${
          new Date(now.getTime() - 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        }&endDate=${endDate}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      )
      if (raceCheck.ok) {
        const events = await raceCheck.json() as any[]
        hasRecentRace = events.some((e: any) =>
          (e.EventType || '').toLowerCase().includes('race') ||
          (e.Name || '').toLowerCase().includes('race')
        )
      }
    } catch (e) { /* continue */ }

    const detectedBlock = block_override
      ? { block: block_override, confidence: 'high' as const, source_titles: [], is_rebuild: false }
      : detectBlock(titles, hasRecentRace)

    // 8. Select key workouts
    const keyWorkouts = selectKeyWorkouts(weekWorkouts)

    // 9. Collect athlete comments
    const athleteComments = weekWorkouts
      .map(w => w.athlete_notes || '')
      .filter(n => n.length > 5)

    // 10. Calculate fitness trends from historical workout data
    const fitnessTrends: FitnessTrend[] = []
    if (historicalWorkouts.length > 0) {
      fitnessTrends.push(calculateFitnessTrend(historicalWorkouts, weekWorkouts, 'combined'))

      for (const sport of ['bike', 'run', 'swim']) {
        const sportHist = historicalWorkouts.filter(w => w.sport === sport)
        const sportWeek = weekWorkouts.filter(w => w.sport === sport)
        if (sportHist.filter(w => w.tss > 0).length >= 5) {
          fitnessTrends.push(calculateFitnessTrend(sportHist, sportWeek, sport))
        }
      }
    }

    // 11. Stress state from TSB
    let stressState = 'Unknown'
    if (fitnessTrends.length > 0) {
      const tsb = fitnessTrends[0].tsb_current
      if (tsb < -40) stressState = 'Compromised'
      else if (tsb < -25) stressState = 'Overreached'
      else if (tsb < -10) stressState = 'Productive Fatigue'
      else if (tsb <= 10) stressState = 'Recovered'
      else if (tsb <= 25) stressState = 'Fresh'
      else stressState = 'Detraining'
    }

    // 12. Race context
    let raceContext: string | null = null
    if (hasRecentRace) {
      raceContext = 'Recent race within last 21 days. Athlete may be in recovery/rebuild phase.'
    }

    // 13. Generate draft with Claude
    const messages = buildAngelaPrompt(
      athleteName, detectedBlock, keyWorkouts, fitnessTrends,
      athleteComments, stressState, weekWorkouts, raceContext, coach_prompt || null
    )
    const draft = await generateDraftWithClaude(ANTHROPIC_API_KEY, messages)

    // 14. Build response
    const feedbackDraft: FeedbackDraft = {
      draft,
      detected_block: detectedBlock,
      key_workouts: keyWorkouts,
      fitness_trends: fitnessTrends,
      athlete_comments: athleteComments,
      stress_state: stressState,
      word_count: draft.split(/\s+/).length,
      generated_at: new Date().toISOString(),
      raw_workout_count: rawWorkouts.length,
      completed_workout_count: weekWorkouts.filter(w => w.completed || w.tss > 0).length,
    }

    return c.json({
      success: true,
      athlete_id,
      athlete_name: athleteName,
      date_range: { start: startDate, end: endDate },
      feedback: feedbackDraft,
    })

  } catch (error: any) {
    console.error('Feedback generation error:', error)
    return c.json({ error: error.message || 'Internal server error' }, 500)
  }
}

export async function regenerateFeedback(c: Context<{ Bindings: Bindings }>) {
  const { ANTHROPIC_API_KEY } = c.env

  try {
    const body = await c.req.json()
    const { previous_draft, coach_instruction, athlete_name, context } = body

    if (!previous_draft || !coach_instruction) {
      return c.json({ error: 'previous_draft and coach_instruction are required' }, 400)
    }

    const messages = JSON.stringify([
      {
        role: 'system',
        content: `You are Angela Naeth, elite endurance coach. You previously wrote a feedback note for ${athlete_name || 'an athlete'}. The coach wants you to revise it. Maintain Angela's voice: direct, data-driven, specific, honest. No generic AI language. No motivational platitudes. Use real metrics. 150-250 words. Angela's word choices: "Dialed" "Controlled" "Zone creep" "Aerobic efficiency" "Keep the discipline" "That's healthy".`
      },
      {
        role: 'user',
        content: `Previous draft:\n\n"${previous_draft}"\n\nContext:\n${JSON.stringify(context || {})}\n\nCoach's instruction: "${coach_instruction}"\n\nRewrite in Angela's voice. 150-250 words. Use actual data from context. Be direct.`
      }
    ])

    const draft = await generateDraftWithClaude(ANTHROPIC_API_KEY, messages)

    return c.json({
      success: true,
      draft,
      word_count: draft.split(/\s+/).length,
      regenerated_at: new Date().toISOString(),
      instruction_used: coach_instruction,
    })

  } catch (error: any) {
    console.error('Regeneration error:', error)
    return c.json({ error: error.message || 'Internal server error' }, 500)
  }
}

export async function saveFeedback(c: Context<{ Bindings: Bindings }>) {
  const { DB, TP_API_BASE_URL } = c.env

  try {
    const body = await c.req.json()
    const { athlete_id, note_text, post_to_tp } = body

    if (!athlete_id || !note_text) {
      return c.json({ error: 'athlete_id and note_text are required' }, 400)
    }

    const user = await DB.prepare(`
      SELECT id FROM users WHERE tp_athlete_id = ?
    `).bind(athlete_id).first<{ id: number }>()

    if (!user) {
      return c.json({ error: 'Athlete not found in database' }, 404)
    }

    const coach = await DB.prepare(`
      SELECT id FROM users WHERE account_type = 'coach' ORDER BY created_at DESC LIMIT 1
    `).first<{ id: number }>()

    await DB.prepare(`
      INSERT INTO athlete_notes (user_id, note_text, note_type, created_by, created_at, updated_at)
      VALUES (?, ?, 'weekly_feedback', ?, datetime('now'), datetime('now'))
      ON CONFLICT(user_id, created_by) DO UPDATE SET
        note_text = excluded.note_text,
        note_type = 'weekly_feedback',
        updated_at = datetime('now')
    `).bind(user.id, note_text, coach?.id || null).run()

    let tpPostResult = null
    if (post_to_tp) {
      try {
        const token = await getValidCoachToken(c)
        if (token) {
          await DB.prepare(`
            INSERT INTO tp_write_queue (user_id, operation, endpoint, payload, status, created_at)
            VALUES (?, 'post_note', ?, ?, 'pending', datetime('now'))
          `).bind(
            user.id,
            `/v1/athlete/${athlete_id}/notes`,
            JSON.stringify({
              Title: 'Weekly Coaching Feedback',
              Body: note_text,
              Date: new Date().toISOString().split('T')[0],
            })
          ).run()
          tpPostResult = 'queued'
        }
      } catch (e) {
        console.error('TP post error:', e)
        tpPostResult = 'error'
      }
    }

    return c.json({ success: true, saved: true, tp_post_status: tpPostResult, saved_at: new Date().toISOString() })

  } catch (error: any) {
    console.error('Save error:', error)
    return c.json({ error: error.message || 'Internal server error' }, 500)
  }
}

export async function getFeedbackAthletes(c: Context<{ Bindings: Bindings }>) {
  const { DB, TP_API_BASE_URL } = c.env

  try {
    // Get valid token (with auto-refresh)
    const token = await getValidCoachToken(c)
    if (!token) {
      return c.json({ error: 'No valid coach token. Please re-authenticate with TrainingPeaks.', athletes: [] }, 401)
    }

    let athletes: any[] = []
    try {
      const res = await fetch(`${TP_API_BASE_URL}/v1/coach/athletes`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) { athletes = await res.json() as any[] }
      else {
        const res2 = await fetch(`${TP_API_BASE_URL}/v2/coach/athletes`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (res2.ok) { athletes = await res2.json() as any[] }
      }
    } catch (e) {
      console.error('Failed to fetch athletes from TP:', e)
    }

    const normalized = athletes.map((a: any) => ({
      id: a.Id || a.id || a.AthleteId || a.athleteId,
      name: [a.FirstName || a.firstName || '', a.LastName || a.lastName || ''].filter(Boolean).join(' ') || ('Athlete ' + (a.Id || a.id)),
      email: a.Email || a.email || null,
    }))

    return c.json({ athletes: normalized, count: normalized.length })
  } catch (error: any) {
    console.error('Athletes fetch error:', error)
    return c.json({ error: error.message, athletes: [] }, 500)
  }
}

export function getBlockTypes(c: Context) {
  return c.json({
    blocks: [
      { key: 'Base/Durability', label: 'BD - Base / Durability', description: 'Aerobic foundation, volume steady' },
      { key: 'Build/Threshold', label: 'BTH - Build / Threshold', description: 'Raise CP/CS, sustained power' },
      { key: 'Aerobic Expansion', label: 'AE - Aerobic Expansion', description: 'Sub-LT1 development' },
      { key: 'VO2 Max', label: 'VO2 - VO2 Max', description: 'Lift aerobic ceiling' },
      { key: 'Specificity', label: 'SP - Specificity', description: 'Race pace execution' },
      { key: 'Hybrid', label: 'Hybrid', description: 'Mixed focus, multiple limiters' },
      { key: 'Rebuild', label: 'Rebuild / Reset', description: 'Post-race or recovery block' },
    ],
  })
}
