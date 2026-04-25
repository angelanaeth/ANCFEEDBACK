/**
 * Intervals.icu API Client
 * Integrates with Intervals.icu for athlete data
 */

export interface IntervalsConfig {
  apiKey: string
  baseUrl: string
}

export interface IntervalsAthlete {
  id: string
  name: string
  email: string
  ctl: number
  atl: number
  tsb: number
}

export interface IntervalsWorkout {
  id: string
  start_date_local: string
  type: string
  name: string
  moving_time: number
  tss: number
  intensity: number
  training_load: number
}

export interface IntervalsWellness {
  id: string
  date: string
  hrv: number
  rhr: number
  sleep_quality: number
  sleep_hours: number
  fatigue: number
  mood: number
  motivation: number
  stress: number
  weight: number
  soreness: number
}

export class IntervalsClient {
  private apiKey: string
  private baseUrl: string

  constructor(config: IntervalsConfig) {
    this.apiKey = config.apiKey
    this.baseUrl = config.baseUrl || 'https://intervals.icu/api/v1'
  }

  private async fetch(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`
    const headers = {
      'Authorization': `Basic ${btoa(`API_KEY:${this.apiKey}`)}`,
      'Content-Type': 'application/json',
      ...options.headers
    }

    const response = await fetch(url, { ...options, headers })
    
    if (!response.ok) {
      throw new Error(`Intervals.icu API error: ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * Get current athlete profile
   */
  async getAthlete(athleteId: string): Promise<IntervalsAthlete> {
    return this.fetch(`/athlete/${athleteId}`)
  }

  /**
   * Get athlete's workouts within date range
   */
  async getWorkouts(athleteId: string, oldest: string, newest: string): Promise<IntervalsWorkout[]> {
    return this.fetch(`/athlete/${athleteId}/activities?oldest=${oldest}&newest=${newest}`)
  }

  /**
   * Get athlete's wellness data
   */
  async getWellness(athleteId: string, oldest: string, newest: string): Promise<IntervalsWellness[]> {
    return this.fetch(`/athlete/${athleteId}/wellness?oldest=${oldest}&newest=${newest}`)
  }

  /**
   * Get athlete's events (races, goals)
   */
  async getEvents(athleteId: string) {
    return this.fetch(`/athlete/${athleteId}/events`)
  }

  /**
   * Create a planned workout
   */
  async createPlannedWorkout(athleteId: string, workout: {
    category: string
    start_date_local: string
    name: string
    description: string
    moving_time: number
    load: number
  }) {
    return this.fetch(`/athlete/${athleteId}/activities`, {
      method: 'POST',
      body: JSON.stringify(workout)
    })
  }

  /**
   * Update wellness data
   */
  async updateWellness(athleteId: string, wellness: Partial<IntervalsWellness>) {
    return this.fetch(`/athlete/${athleteId}/wellness`, {
      method: 'POST',
      body: JSON.stringify(wellness)
    })
  }

  /**
   * Get athlete's fitness data (CTL/ATL/TSB over time)
   */
  async getFitness(athleteId: string, oldest: string, newest: string) {
    return this.fetch(`/athlete/${athleteId}/fitness?oldest=${oldest}&newest=${newest}`)
  }

  /**
   * Get current fitness summary
   */
  async getCurrentFitness(athleteId: string) {
    const athlete = await this.getAthlete(athleteId)
    return {
      ctl: athlete.ctl,
      atl: athlete.atl,
      tsb: athlete.tsb
    }
  }
}

/**
 * Helper: Convert Intervals.icu data to Angela's format
 */
export function normalizeIntervalsData(
  athlete: IntervalsAthlete,
  workouts: IntervalsWorkout[],
  wellness: IntervalsWellness[]
) {
  return {
    athlete: {
      id: athlete.id,
      name: athlete.name,
      email: athlete.email
    },
    metrics: {
      ctl: athlete.ctl,
      atl: athlete.atl,
      tsb: athlete.tsb
    },
    workouts: workouts.map(w => ({
      id: w.id,
      date: w.start_date_local,
      type: w.type,
      name: w.name,
      duration: w.moving_time,
      tss: w.tss,
      intensity: w.intensity
    })),
    wellness: wellness.map(w => ({
      date: w.date,
      hrv: w.hrv,
      rhr: w.rhr,
      sleepQuality: w.sleep_quality,
      sleepHours: w.sleep_hours,
      fatigue: w.fatigue,
      mood: w.mood,
      motivation: w.motivation,
      stress: w.stress,
      soreness: w.soreness
    }))
  }
}
