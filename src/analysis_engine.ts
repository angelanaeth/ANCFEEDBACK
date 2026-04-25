/**
 * Angela/Echodevo Brain - Analysis Engine
 * Comprehensive athlete analysis with multi-tier assessment
 */

import { CTL_TAU, ATL_TAU } from './tss_planner_constants'

// ============================================================================
// TYPES
// ============================================================================

interface WorkoutData {
  date: string
  sport: string
  tss: number
  duration: number
  if?: number
  np?: number
  avg_power?: number
  avg_hr?: number
  distance?: number
  completed: boolean
}

interface SportMetrics {
  ctl: number
  atl: number
  tsb: number
}

interface WellnessData {
  hrv?: number
  rhr?: number
  sleep_hours?: number
  sleep_quality?: number
  soreness?: number
  fatigue?: number
  stress?: number
  mood?: number
}

interface AnalysisMetrics {
  fat_ox: number
  durability_index: number
  aerobic_efficiency: number
  threshold_sustainability: number
  fueling_efficiency: number
  bike_decoupling: number
  run_decoupling: number
  zone2_percent: number
  threshold_percent: number
  high_intensity_percent: number
}

interface AthleteAnalysisInput {
  athlete_id: string
  name: string
  start_date: string
  end_date: string
  current_date: string
  metrics: {
    ctl: number
    atl: number
    tsb: number
  }
  sport_metrics: {
    bike: SportMetrics
    run: SportMetrics
    swim: SportMetrics
  }
  workouts: WorkoutData[]
  wellness?: WellnessData
  block_type?: string
  notes?: string
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Calculate stress state from TSB and ATL/CTL ratio
 */
function calculateStressState(tsb: number, ctl: number, atl: number): string {
  const ratio = ctl > 0 ? atl / ctl : 0
  
  if (tsb < -30) return 'Compromised'
  if (tsb < -20 && ratio > 1.25) return 'Overreached'
  if (tsb < -10 && ratio > 1.10) return 'Functional Overreach'
  if (tsb > 10) return 'Recovered'
  return 'Productive'
}

/**
 * Project CTL/ATL forward with decay (no new TSS)
 */
function projectMetricsForward(
  currentCTL: number,
  currentATL: number,
  daysForward: number
): { ctl: number; atl: number; tsb: number } {
  let ctl = currentCTL
  let atl = currentATL
  
  // Project forward with decay (0 TSS days)
  for (let i = 0; i < daysForward; i++) {
    ctl = ctl + (0 - ctl) / CTL_TAU
    atl = atl + (0 - atl) / ATL_TAU
  }
  
  return {
    ctl: Math.round(ctl * 10) / 10,
    atl: Math.round(atl * 10) / 10,
    tsb: Math.round((ctl - atl) * 10) / 10
  }
}

/**
 * Get next Sunday from a date
 */
function getNextSunday(fromDate: Date): Date {
  const date = new Date(fromDate)
  const dayOfWeek = date.getDay()
  const daysUntilSunday = dayOfWeek === 0 ? 7 : 7 - dayOfWeek
  date.setDate(date.getDate() + daysUntilSunday)
  return date
}

/**
 * Get next Wednesday from a date
 */
function getNextWednesday(fromDate: Date): Date {
  const date = new Date(fromDate)
  const dayOfWeek = date.getDay()
  let daysUntilWednesday
  
  if (dayOfWeek <= 3) {
    daysUntilWednesday = 3 - dayOfWeek
  } else {
    daysUntilWednesday = 10 - dayOfWeek
  }
  
  date.setDate(date.getDate() + daysUntilWednesday)
  return date
}

/**
 * Calculate days between two dates
 */
function daysBetween(date1: Date, date2: Date): number {
  const diffTime = Math.abs(date2.getTime() - date1.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

/**
 * Calculate Fat Oxidation capacity (Zone 2 work percentage)
 */
function calculateFatOx(workouts: WorkoutData[]): number {
  const zone2Threshold = 0.75 // IF < 0.75 is Zone 2
  
  let zone2Duration = 0
  let totalDuration = 0
  
  for (const workout of workouts) {
    if (workout.completed && workout.duration > 0) {
      totalDuration += workout.duration
      
      if (workout.if && workout.if < zone2Threshold) {
        zone2Duration += workout.duration
      } else if (!workout.if) {
        // Estimate: assume swim and easy runs are zone 2
        if (workout.sport === 'swim' || (workout.sport === 'run' && workout.tss < 70)) {
          zone2Duration += workout.duration * 0.7 // Conservative estimate
        }
      }
    }
  }
  
  return totalDuration > 0 ? zone2Duration / totalDuration : 0
}

/**
 * Calculate Durability Index from decoupling
 */
function calculateDurabilityIndex(bikeDecoup: number, runDecoup: number): number {
  // DI = 1 - ((bike_decoupling/5 + run_decoupling/8) / 2)
  return 1 - ((bikeDecoup / 5 + runDecoup / 8) / 2)
}

/**
 * Calculate decoupling for a sport (simplified - needs power/HR data)
 */
function estimateDecoupling(workouts: WorkoutData[], sport: string): number {
  // Simplified: estimate based on workout duration and intensity
  const sportWorkouts = workouts.filter(w => w.sport === sport && w.completed && w.duration > 3600)
  
  if (sportWorkouts.length === 0) return 0
  
  // Estimate decoupling based on IF and duration
  let totalDecoup = 0
  let count = 0
  
  for (const workout of sportWorkouts) {
    if (workout.if) {
      // Higher IF + longer duration = more decoupling
      const durationHours = workout.duration / 3600
      const estimatedDecoup = (workout.if - 0.65) * durationHours * 10
      totalDecoup += Math.max(0, Math.min(estimatedDecoup, 15))
      count++
    }
  }
  
  return count > 0 ? totalDecoup / count : 0
}

/**
 * Calculate intensity distribution
 */
function calculateIntensityDistribution(workouts: WorkoutData[]): {
  zone2_percent: number
  threshold_percent: number
  high_intensity_percent: number
} {
  let zone2Duration = 0
  let thresholdDuration = 0
  let highIntensityDuration = 0
  let totalDuration = 0
  
  for (const workout of workouts) {
    if (workout.completed && workout.duration > 0) {
      totalDuration += workout.duration
      
      if (workout.if) {
        if (workout.if < 0.75) {
          zone2Duration += workout.duration
        } else if (workout.if < 0.85) {
          thresholdDuration += workout.duration
        } else {
          highIntensityDuration += workout.duration
        }
      }
    }
  }
  
  if (totalDuration === 0) {
    return { zone2_percent: 0, threshold_percent: 0, high_intensity_percent: 0 }
  }
  
  return {
    zone2_percent: Math.round((zone2Duration / totalDuration) * 100),
    threshold_percent: Math.round((thresholdDuration / totalDuration) * 100),
    high_intensity_percent: Math.round((highIntensityDuration / totalDuration) * 100)
  }
}

/**
 * Calculate Echo Estimate (weekly TSS to maintain CTL)
 */
function calculateEchoEstimate(ctlSunday: number): number {
  return (7 * ctlSunday) / 0.965
}

/**
 * Get TSS recommendation range based on stress state
 */
function getTSSRecommendation(
  echoEstimate: number,
  stressState: string
): { low: number; high: number; change_percent: string } {
  let lowChange: number, highChange: number, changePercent: string
  
  switch (stressState) {
    case 'Compromised':
      lowChange = 0.5
      highChange = 0.7
      changePercent = '-30% to -50%'
      break
    case 'Overreached':
      lowChange = 0.85
      highChange = 0.95
      changePercent = '-5% to -15%'
      break
    case 'Recovered':
      lowChange = 1.10
      highChange = 1.15
      changePercent = '+10% to +15%'
      break
    case 'Productive':
    default:
      lowChange = 0.98
      highChange = 1.05
      changePercent = '-2% to +5%'
  }
  
  return {
    low: Math.round(echoEstimate * lowChange),
    high: Math.round(echoEstimate * highChange),
    change_percent: changePercent
  }
}

// ============================================================================
// MAIN ANALYSIS FUNCTION
// ============================================================================

/**
 * Perform comprehensive athlete analysis
 */
export function analyzeAthlete(input: AthleteAnalysisInput) {
  const currentDate = new Date(input.current_date)
  const nextSunday = getNextSunday(currentDate)
  const nextWednesday = getNextWednesday(currentDate)
  
  const daysToSunday = daysBetween(currentDate, nextSunday)
  const daysToWednesday = daysBetween(currentDate, nextWednesday)
  
  // Project metrics forward
  const sundayProjection = projectMetricsForward(
    input.metrics.ctl,
    input.metrics.atl,
    daysToSunday
  )
  
  const wednesdayProjection = projectMetricsForward(
    input.metrics.ctl,
    input.metrics.atl,
    daysToWednesday
  )
  
  // Calculate stress state
  const stressState = calculateStressState(
    input.metrics.tsb,
    input.metrics.ctl,
    input.metrics.atl
  )
  
  // Calculate analysis metrics
  const fatOx = calculateFatOx(input.workouts)
  const bikeDecoupling = estimateDecoupling(input.workouts, 'bike')
  const runDecoupling = estimateDecoupling(input.workouts, 'run')
  const durabilityIndex = calculateDurabilityIndex(bikeDecoupling, runDecoupling)
  const intensityDist = calculateIntensityDistribution(input.workouts)
  
  // Calculate sport totals
  const sportTotals = {
    bike: { tss: 0, duration: 0, count: 0 },
    run: { tss: 0, duration: 0, count: 0 },
    swim: { tss: 0, duration: 0, count: 0 }
  }
  
  for (const workout of input.workouts) {
    if (workout.completed) {
      const sport = workout.sport as 'bike' | 'run' | 'swim'
      if (sportTotals[sport]) {
        sportTotals[sport].tss += workout.tss
        sportTotals[sport].duration += workout.duration
        sportTotals[sport].count++
      }
    }
  }
  
  const totalTSS = sportTotals.bike.tss + sportTotals.run.tss + sportTotals.swim.tss
  
  // Calculate Echo Estimate and TSS recommendation
  const echoEstimate = calculateEchoEstimate(sundayProjection.ctl)
  const tssRecommendation = getTSSRecommendation(echoEstimate, stressState)
  
  // Build analysis metrics
  const analysisMetrics: AnalysisMetrics = {
    fat_ox: Math.round(fatOx * 100) / 100,
    durability_index: Math.round(durabilityIndex * 100) / 100,
    aerobic_efficiency: Math.round(fatOx * 0.85 * 100) / 100, // Simplified
    threshold_sustainability: 0.92, // Would need FTP test data
    fueling_efficiency: 0.85, // Would need fueling logs
    bike_decoupling: Math.round(bikeDecoupling * 10) / 10,
    run_decoupling: Math.round(runDecoupling * 10) / 10,
    zone2_percent: intensityDist.zone2_percent,
    threshold_percent: intensityDist.threshold_percent,
    high_intensity_percent: intensityDist.high_intensity_percent
  }
  
  // Return comprehensive analysis
  return {
    athlete_id: input.athlete_id,
    name: input.name,
    start_date: input.start_date,
    end_date: input.end_date,
    current_date: input.current_date,
    
    // Current metrics
    metrics: {
      ...input.metrics,
      ctl_sunday: sundayProjection.ctl,
      atl_sunday: sundayProjection.atl,
      tsb_sunday: sundayProjection.tsb,
      tsb_wednesday: wednesdayProjection.tsb
    },
    
    // Sport-specific metrics
    sport_metrics: input.sport_metrics,
    
    // Sport totals
    sport_totals: {
      bike: {
        tss: Math.round(sportTotals.bike.tss),
        hours: Math.round((sportTotals.bike.duration / 3600) * 10) / 10,
        count: sportTotals.bike.count
      },
      run: {
        tss: Math.round(sportTotals.run.tss),
        hours: Math.round((sportTotals.run.duration / 3600) * 10) / 10,
        count: sportTotals.run.count
      },
      swim: {
        tss: Math.round(sportTotals.swim.tss),
        hours: Math.round((sportTotals.swim.duration / 3600) * 10) / 10,
        count: sportTotals.swim.count
      }
    },
    
    // Total TSS
    total_tss: Math.round(totalTSS),
    
    // Workouts
    workouts: input.workouts,
    
    // Wellness
    wellness: input.wellness || {},
    
    // Analysis metrics
    analysis_metrics: analysisMetrics,
    
    // Block type and stress state
    block_type: input.block_type || 'Not Set',
    stress_state: stressState,
    
    // Projections
    projections: {
      coming_sunday: {
        date: nextSunday.toISOString().split('T')[0],
        ctl: sundayProjection.ctl,
        atl: sundayProjection.atl,
        tsb: sundayProjection.tsb
      },
      mid_week_wednesday: {
        date: nextWednesday.toISOString().split('T')[0],
        tsb: wednesdayProjection.tsb
      }
    },
    
    // TSS Recommendation
    tss_recommendation: {
      echo_estimate: Math.round(echoEstimate),
      range: tssRecommendation,
      weekly_tss_target: `${tssRecommendation.low}-${tssRecommendation.high}`
    },
    
    // Notes
    notes: input.notes || ''
  }
}

// ============================================================================
// EXPORTED HELPER FUNCTIONS FOR API ENDPOINTS
// ============================================================================

/**
 * Calculate current metrics from database
 * Mock implementation - to be replaced with real DB queries
 */
export async function calculateCurrentMetrics(athleteId: string, DB: any) {
  // Mock data - replace with real TrainingPeaks data
  return {
    ctl: 82,
    atl: 94,
    tsb: -12,
    swim_ctl: 15,
    swim_atl: 18,
    swim_tss_7d: 120,
    bike_ctl: 45,
    bike_atl: 52,
    bike_tss_7d: 380,
    run_ctl: 22,
    run_atl: 24,
    run_tss_7d: 180,
    hrv: null,
    resting_hr: null,
    sleep_hours: null,
    sleep_score: null,
    soreness: 'minor_issue',
    mood: 'good',
    stress: 'normal',
    block_type: 'Build/Threshold',
    weeks_in_block: 4,
    echo_estimate: 580
  }
}

/**
 * Project future metrics based on planned TSS
 */
export async function projectFutureMetrics(
  currentCtl: number,
  currentAtl: number,
  plannedWeeklyTss: number,
  days: number = 7
) {
  const dailyTss = plannedWeeklyTss / 7
  
  let ctl = currentCtl
  let atl = currentAtl
  
  // Project forward day by day
  for (let i = 0; i < days; i++) {
    ctl = ctl + (dailyTss - ctl) / CTL_TAU
    atl = atl + (dailyTss - atl) / ATL_TAU
  }
  
  const tsb = ctl - atl
  
  return {
    ctl_7d: Math.round(ctl),
    atl_7d: Math.round(atl),
    tsb_7d: Math.round(tsb),
    ctl_14d: Math.round(ctl + (dailyTss - ctl) / CTL_TAU * 7),
    atl_14d: Math.round(atl + (dailyTss - atl) / ATL_TAU * 7),
    tsb_14d: Math.round((ctl + (dailyTss - ctl) / CTL_TAU * 7) - (atl + (dailyTss - atl) / ATL_TAU * 7)),
    ctl_30d: Math.round(ctl + (dailyTss - ctl) / CTL_TAU * 23),
    atl_30d: Math.round(atl + (dailyTss - atl) / ATL_TAU * 23),
    tsb_30d: Math.round((ctl + (dailyTss - ctl) / CTL_TAU * 23) - (atl + (dailyTss - atl) / ATL_TAU * 23))
  }
}

/**
 * Compute fatigue state and readiness score
 */
export function computeFatigueState(ctl: number, atl: number, tsb: number) {
  const atlCtlRatio = atl / ctl
  
  let state: string
  let readiness_score: number
  let stress_category: string
  let recommended_block: string
  
  if (tsb < -30) {
    state = 'Severely Overreached'
    readiness_score = 2
    stress_category = 'Critical'
    recommended_block = 'Recovery'
  } else if (tsb < -20) {
    state = 'Overreached'
    readiness_score = 4
    stress_category = 'High Fatigue'
    recommended_block = 'Recovery'
  } else if (tsb < -10) {
    state = 'Building Fitness'
    readiness_score = 6
    stress_category = 'Productive Stress'
    recommended_block = 'Build/Threshold'
  } else if (tsb < 0) {
    state = 'Optimal Training State'
    readiness_score = 8
    stress_category = 'Optimal'
    recommended_block = 'Build/Threshold'
  } else if (tsb < 10) {
    state = 'Fresh'
    readiness_score = 9
    stress_category = 'Race Ready'
    recommended_block = 'Specificity'
  } else {
    state = 'Well-Rested'
    readiness_score = 7
    stress_category = 'Detraining Risk'
    recommended_block = 'Base/Durability'
  }
  
  return {
    state,
    readiness_score,
    stress_category,
    recommended_block,
    atl_ctl_ratio: Math.round(atlCtlRatio * 100) / 100
  }
}

/**
 * Compute durability index from decoupling metrics
 */
export function computeDurability(bikeDecoup: number, runDecoup: number): number {
  // Lower decoupling = higher durability
  // Scale: 0-100, where 100 is perfect (0% decoupling)
  const bikeDurability = Math.max(0, 100 - (bikeDecoup * 10))
  const runDurability = Math.max(0, 100 - (runDecoup * 10))
  
  return Math.round((bikeDurability + runDurability) / 2)
}
