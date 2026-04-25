/**
 * ANC Athlete Feedback Module
 * Generates coach-edited athlete feedback notes in Angela's voice
 * Uses: TrainingPeaks data + Analysis Engine + Claude AI
 * 
 * Integrates with existing:
 *  - getCoachToken() from index.tsx
 *  - analysis_engine.ts for stress state / metrics
 *  - gpt/gpt-api.ts for TP data normalization
 *  - D1 database (users, training_metrics, athlete_notes tables)
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

interface KeyWorkout {
  date: string
  title: string
  sport: string
  tss: number
  duration_minutes: number
  athlete_notes: string | null
  execution_quality: string
}

interface FitnessTrend {
  sport: string
  ctl_4wk: number[]
  atl_4wk: number[]
  tsb_4wk: number[]
  ctl_direction: 'building' | 'stable' | 'declining'
  ctl_change: number
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
}

// ============================================================================
// BLOCK DETECTION
// ============================================================================

const BLOCK_PATTERNS: Record<string, RegExp[]> = {
  'Base/Durability': [
    /\bBD\b/i,
    /\bbase\b/i,
    /\bdurability\b/i,
    /\bZ[12]\s*(run|ride|bike)/i,
    /\bZR\b/i,
    /\baerobic\s*(run|ride|bike)/i,
    /\beasy\s*(run|ride|bike)/i,
  ],
  'Build/Threshold': [
    /\bBTH\b/i,
    /\bbuild\b/i,
    /\bthreshold\b/i,
    /\bZ3\b/i,
    /\bFTP\b/i,
    /\bSST\b/i,
    /\bsweet\s*spot/i,
    /\btempo\b/i,
  ],
  'Aerobic Expansion': [
    /\bAE\b/i,
    /\baerobic\s*expansion/i,
    /\bsub[- ]?LT1/i,
  ],
  'VO2 Max': [
    /\bVO2\b/i,
    /\bZ5\b/i,
    /\bintervals?\b.*\b(3|4|5)\s*min/i,
    /\b110\s*%/i,
  ],
  'Specificity': [
    /\bSP\b/i,
    /\bspec\b/i,
    /\brace\s*pace/i,
    /\brick\b/i,
    /\bsimulation/i,
  ],
  'Rebuild': [
    /\brebuild\b/i,
    /\brecovery\s*block/i,
    /\breset\b/i,
  ],
}

/**
 * Detect training block from workout titles
 */
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
    if (count > topVotes) {
      topBlock = block
      topVotes = count
    }
  }

  const totalWorkouts = workoutTitles.length
  let confidence: 'high' | 'medium' | 'low' = 'low'
  if (totalWorkouts > 0) {
    const ratio = topVotes / totalWorkouts
    if (ratio >= 0.5) confidence = 'high'
    else if (ratio >= 0.25) confidence = 'medium'
  }

  const isRebuild = hasRecentRace && (topBlock === 'Base/Durability' || topBlock === 'Rebuild')
  if (isRebuild) {
    topBlock = 'Rebuild'
    confidence = hasRecentRace ? 'medium' : confidence
  }

  return {
    block: topBlock,
    confidence,
    source_titles: matchedTitles[topBlock] || [],
    is_rebuild: isRebuild,
  }
}

// ============================================================================
// WORKOUT SELECTION (pick 1-3 key sessions to highlight)
// ============================================================================

function selectKeyWorkouts(workouts: any[], maxCount: number = 3): KeyWorkout[] {
  if (!workouts || workouts.length === 0) return []

  const scored = workouts
    .filter((w: any) => w.completed || w.CompletedDate || w.TotalTime > 0)
    .map((w: any) => {
      let score = 0
      const tss = w.tss || w.TSS || w.TrainingStressScore || 0
      const duration = w.duration || (w.TotalTime ? w.TotalTime / 60 : 0)
      const title = w.title || w.Title || ''
      const notes = w.athlete_notes || w.AthleteNotes || w.Description || ''

      score += Math.min(tss / 20, 5)
      score += Math.min(duration / 30, 3)
      if (notes && notes.length > 5) score += 3
      if (/threshold|tempo|interval|VO2|race|test|brick|long/i.test(title)) score += 2
      if (/recovery|easy|ZR|rest/i.test(title)) score -= 2

      return {
        date: w.date || w.WorkoutDay || '',
        title: title,
        sport: (w.sport || w.WorkoutType || 'other').toLowerCase(),
        tss: tss,
        duration_minutes: Math.round(duration),
        athlete_notes: notes || null,
        execution_quality: tss > 0 ? 'completed' : 'unknown',
        _score: score,
      }
    })
    .sort((a: any, b: any) => b._score - a._score)
    .slice(0, maxCount)

  return scored.map(({ _score, ...rest }: any) => rest)
}

// ============================================================================
// FITNESS TREND CALCULATION (4-week CTL/ATL/TSB history)
// ============================================================================

function calculateFitnessTrend(
  ctl4wk: number[],
  atl4wk: number[],
  tsb4wk: number[],
  sport: string
): FitnessTrend {
  const ctlChange = ctl4wk.length >= 2
    ? ctl4wk[ctl4wk.length - 1] - ctl4wk[0]
    : 0

  let direction: 'building' | 'stable' | 'declining' = 'stable'
  if (ctlChange > 3) direction = 'building'
  else if (ctlChange < -3) direction = 'declining'

  return {
    sport,
    ctl_4wk: ctl4wk,
    atl_4wk: atl4wk,
    tsb_4wk: tsb4wk,
    ctl_direction: direction,
    ctl_change: Math.round(ctlChange),
  }
}

// ============================================================================
// CLAUDE DRAFT GENERATION (Angela's Voice)
// ============================================================================

function buildAngelaPrompt(
  athleteName: string,
  block: DetectedBlock,
  keyWorkouts: KeyWorkout[],
  fitnessTrends: FitnessTrend[],
  athleteComments: string[],
  stressState: string,
  raceContext: string | null,
  coachPrompt: string | null
): string {
  const workoutDetails = keyWorkouts.map(w => {
    let detail = `- ${w.date}: "${w.title}" (${w.sport}, TSS ${w.tss}, ${w.duration_minutes}min)`
    if (w.athlete_notes) detail += `\n  Athlete said: "${w.athlete_notes}"`
    return detail
  }).join('\n')

  const trendDetails = fitnessTrends.map(t => {
    const latest = t.ctl_4wk[t.ctl_4wk.length - 1] || 0
    const oldest = t.ctl_4wk[0] || 0
    const latestATL = t.atl_4wk[t.atl_4wk.length - 1] || 0
    const latestTSB = t.tsb_4wk[t.tsb_4wk.length - 1] || 0
    return `${t.sport.toUpperCase()}: CTL ${oldest}->${latest} (${t.ctl_direction}, ${t.ctl_change > 0 ? '+' : ''}${t.ctl_change}), ATL ${latestATL}, TSB ${latestTSB}`
  }).join('\n')

  const commentsSection = athleteComments.length > 0
    ? `ATHLETE'S OWN COMMENTS FROM THIS WEEK:\n${athleteComments.map(c => `- "${c}"`).join('\n')}`
    : 'No athlete comments this week.'

  const systemPrompt = `You are Angela Naeth, an elite endurance coach who has raced at the highest levels of triathlon (Ironman). You write athlete feedback notes that are:

VOICE CHARACTERISTICS:
- Professional but human - you talk TO athletes, not AT them
- Data-informed but not numbers-heavy - reference specific workouts and trends, but frame them in coaching language
- Motivational but honest - you acknowledge effort AND give real feedback
- Specific to execution - you reference actual workout data, not generic praise
- You acknowledge athlete comments directly - "You mentioned..." / "When you said..."
- You connect weekly work to long-term fitness building
- You use controlled, measured phrasing - not exclamation marks or hype
- You occasionally use a short, punchy sentence for impact: "This is working."
- You reference physiology naturally: CTL, ATL, TSB - but explain what they mean for the athlete

WHAT YOU NEVER DO:
- Generic AI language ("Great week!", "Keep up the good work!", "You crushed it!")
- List what they did day-by-day
- Mention upcoming training plan (that's System 2, not your job)
- Ignore their comments or effort
- Use excessive emojis or exclamation marks

STRUCTURE (200-300 words):
1. Opening: Acknowledge the week, the block they're in, their effort
2. Specific wins: 1-2 key workouts + how they executed them
3. Fitness picture: CTL/ATL/TSB trends over 4 weeks, what it means
4. Connection: How this week's execution supports their fitness trajectory
5. Coaching message: Motivational, honest, forward-looking (but NOT prescriptive about next week)`

  const userPrompt = `Write a weekly feedback note for ${athleteName}.

CURRENT BLOCK: ${block.block} (confidence: ${block.confidence})
STRESS STATE: ${stressState}
${raceContext ? `RACE CONTEXT: ${raceContext}` : ''}

KEY WORKOUTS THIS WEEK:
${workoutDetails || 'Limited workout data available.'}

FITNESS TRENDS (4-week view):
${trendDetails || 'Limited trend data available.'}

${commentsSection}

${coachPrompt ? `COACH'S SPECIFIC INSTRUCTION: ${coachPrompt}` : ''}

Write 200-300 words in Angela's voice. Reference specific workouts. Reference athlete comments if any. Frame the fitness data in coaching language. End with a coaching support message.`

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

/**
 * POST /api/feedback/generate
 * Generate an athlete feedback draft
 */
export async function generateFeedback(c: Context<{ Bindings: Bindings }>) {
  const { DB, TP_API_BASE_URL, ANTHROPIC_API_KEY } = c.env

  try {
    const body: FeedbackRequest = await c.req.json()
    const { athlete_id, date_range, block_override, coach_prompt, sport_focus } = body

    if (!athlete_id) {
      return c.json({ error: 'athlete_id is required' }, 400)
    }

    console.log(`Generating feedback for athlete ${athlete_id}, range: ${date_range}`)

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

    // 2. Get coach token
    const coachResult = await DB.prepare(`
      SELECT access_token FROM users
      WHERE account_type = 'coach'
      ORDER BY created_at DESC LIMIT 1
    `).first<{ access_token: string }>()

    if (!coachResult?.access_token) {
      return c.json({ error: 'No coach token found. Connect TrainingPeaks first.' }, 401)
    }

    const token = coachResult.access_token

    // 3. Fetch workouts from TrainingPeaks
    let workouts: any[] = []
    try {
      const res = await fetch(
        `${TP_API_BASE_URL}/v1/athlete/${athlete_id}/workouts?startDate=${startDate}&endDate=${endDate}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      )
      if (res.ok) {
        workouts = await res.json() as any[]
      } else {
        const res2 = await fetch(
          `${TP_API_BASE_URL}/v2/workouts/${athlete_id}/${startDate}/${endDate}`,
          { headers: { 'Authorization': `Bearer ${token}` } }
        )
        if (res2.ok) {
          workouts = await res2.json() as any[]
        }
      }
    } catch (e) {
      console.error('Failed to fetch workouts:', e)
    }

    // Filter by sport if specified
    if (sport_focus && sport_focus !== 'all') {
      workouts = workouts.filter((w: any) => {
        const sport = (w.WorkoutType || w.sport || '').toLowerCase()
        return sport === sport_focus
      })
    }

    console.log(`Fetched ${workouts.length} workouts for ${startDate} to ${endDate}`)

    // 4. Get athlete name
    const athleteUser = await DB.prepare(`
      SELECT name FROM users WHERE tp_athlete_id = ?
    `).bind(athlete_id).first<{ name: string }>()
    const athleteName = athleteUser?.name || `Athlete ${athlete_id}`

    // 5. Get workout titles for block detection
    const titles = workouts.map((w: any) => w.Title || w.title || '').filter(Boolean)

    // 6. Check for recent races
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
    } catch (e) {
      // Events endpoint may not be available - continue
    }

    // 7. Detect block
    const detectedBlock = block_override
      ? { block: block_override, confidence: 'high' as const, source_titles: [], is_rebuild: false }
      : detectBlock(titles, hasRecentRace)

    // 8. Select key workouts
    const keyWorkouts = selectKeyWorkouts(workouts)

    // 9. Collect athlete comments
    const athleteComments = workouts
      .map((w: any) => w.AthleteNotes || w.athlete_notes || w.Description || '')
      .filter((n: string) => n && n.length > 5 && !/^\s*$/.test(n))

    // 10. Get fitness trends (4-week history from DB)
    const fitnessTrends: FitnessTrend[] = []
    try {
      const metricsHistory = await DB.prepare(`
        SELECT date, ctl, atl, tsb, sport_metrics, stress_state
        FROM training_metrics
        WHERE user_id = (SELECT id FROM users WHERE tp_athlete_id = ?)
        ORDER BY date DESC
        LIMIT 28
      `).bind(athlete_id).all()

      if (metricsHistory.results && metricsHistory.results.length > 0) {
        const rows = metricsHistory.results.reverse()
        const weeklySnapshots = rows.filter((_: any, i: number) => i % 7 === 0 || i === rows.length - 1)

        const ctlValues = weeklySnapshots.map((r: any) => r.ctl || 0)
        const atlValues = weeklySnapshots.map((r: any) => r.atl || 0)
        const tsbValues = weeklySnapshots.map((r: any) => r.tsb || 0)

        fitnessTrends.push(calculateFitnessTrend(ctlValues, atlValues, tsbValues, 'combined'))

        for (const row of [rows[rows.length - 1]]) {
          if (row?.sport_metrics) {
            try {
              const sportData = typeof row.sport_metrics === 'string'
                ? JSON.parse(row.sport_metrics)
                : row.sport_metrics

              for (const sport of ['bike', 'run', 'swim']) {
                if (sportData[sport] && sportData[sport].ctl) {
                  fitnessTrends.push(calculateFitnessTrend(
                    [sportData[sport].ctl],
                    [sportData[sport].atl || 0],
                    [sportData[sport].tsb || 0],
                    sport
                  ))
                }
              }
            } catch (e) { /* ignore parse errors */ }
          }
        }
      }
    } catch (e) {
      console.warn('Could not fetch fitness history:', e)
    }

    // 11. Get stress state
    let stressState = 'Unknown'
    try {
      const latestMetrics = await DB.prepare(`
        SELECT stress_state FROM training_metrics
        WHERE user_id = (SELECT id FROM users WHERE tp_athlete_id = ?)
        ORDER BY date DESC LIMIT 1
      `).bind(athlete_id).first<{ stress_state: string }>()
      stressState = latestMetrics?.stress_state || 'Productive'
    } catch (e) { /* use default */ }

    // 12. Race context string
    let raceContext: string | null = null
    if (hasRecentRace) {
      raceContext = 'Recent race within last 21 days. Athlete may be in recovery/rebuild phase.'
    }

    // 13. Generate draft with Claude
    const messages = buildAngelaPrompt(
      athleteName,
      detectedBlock,
      keyWorkouts,
      fitnessTrends,
      athleteComments,
      stressState,
      raceContext,
      coach_prompt || null
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
    }

    console.log(`Draft generated: ${feedbackDraft.word_count} words for ${athleteName}`)

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

/**
 * POST /api/feedback/regenerate
 * Re-draft with coach instructions
 */
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
        content: `You are Angela Naeth, elite endurance coach. You previously wrote a feedback note for ${athlete_name || 'an athlete'}. The coach wants you to revise it. Maintain Angela's voice: professional, data-informed, human, motivational but honest. No generic AI language. 200-300 words.`
      },
      {
        role: 'user',
        content: `Here is the previous draft:\n\n"${previous_draft}"\n\nContext about the athlete this week:\n${JSON.stringify(context || {})}\n\nCoach's instruction for revision: "${coach_instruction}"\n\nRewrite the note following the coach's instruction while maintaining Angela's voice and keeping it 200-300 words.`
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

/**
 * POST /api/feedback/save
 * Save a finalized note to the database (and optionally post to TP)
 */
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
        const coachToken = await DB.prepare(`
          SELECT access_token FROM users WHERE account_type = 'coach' ORDER BY created_at DESC LIMIT 1
        `).first<{ access_token: string }>()

        if (coachToken?.access_token) {
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

    return c.json({
      success: true,
      saved: true,
      tp_post_status: tpPostResult,
      saved_at: new Date().toISOString(),
    })

  } catch (error: any) {
    console.error('Save error:', error)
    return c.json({ error: error.message || 'Internal server error' }, 500)
  }
}

/**
 * GET /api/feedback/athletes
 * Load athletes using the coach token from the database (no cookie required)
 */
export async function getFeedbackAthletes(c: Context<{ Bindings: Bindings }>) {
  const { DB, TP_API_BASE_URL } = c.env

  try {
    const coachResult = await DB.prepare(`
      SELECT access_token FROM users
      WHERE account_type = 'coach'
      ORDER BY created_at DESC LIMIT 1
    `).first<{ access_token: string }>()

    if (!coachResult?.access_token) {
      return c.json({ error: 'No coach token found. Log in at angela-coach.pages.dev first.', athletes: [] }, 401)
    }

    const token = coachResult.access_token

    let athletes: any[] = []
    try {
      const res = await fetch(`${TP_API_BASE_URL}/v1/coach/athletes`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        athletes = await res.json() as any[]
      } else {
        const res2 = await fetch(`${TP_API_BASE_URL}/v2/coach/athletes`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (res2.ok) {
          athletes = await res2.json() as any[]
        }
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

/**
 * GET /api/feedback/blocks
 * Get available block types for the coach to select from
 */
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
