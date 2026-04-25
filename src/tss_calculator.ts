/**
 * Angela Engine v5.1 - TSS Recommendation Calculator
 * Complete port from Echo-devo Python implementation
 */

import { BLOCK_CONFIGS, COMMON_OPTIONS, CTL_TAU, ATL_TAU, HISTORY_DAYS } from './tss_planner_constants'

interface RangeConfig {
  value: number;
  low: number;
  high: number;
}

interface StringConfig {
  value: number;
  we_str?: string;
  ls_str?: string;
  of_str?: string;
}

interface RecommendationScale {
  recommendation: string;
  low: number;
  high: number;
  low_change: number;
  high_change: number;
}

/**
 * Calculate Exponentially Weighted Moving Average (EWMA)
 */
function ewma(values: number[], tau: number, seedWithFirst: boolean = true): number[] {
  if (values.length === 0) return [];
  
  const result: number[] = [];
  let current = seedWithFirst ? values[0] : 0;
  result.push(current);
  
  for (let i = 1; i < values.length; i++) {
    current = current + (values[i] - current) / tau;
    result.push(current);
  }
  
  return result;
}

/**
 * Find score for a value within range configurations
 */
function findScoreInRange(value: number, configs: RangeConfig[]): number {
  for (const config of configs) {
    if (value >= config.low && value <= config.high) {
      return config.value;
    }
  }
  return 0; // Default fallback
}

/**
 * Find score by string match
 */
function findScoreByString(
  input: string,
  configs: StringConfig[],
  key: 'we_str' | 'ls_str' | 'of_str'
): number {
  for (const config of configs) {
    if (config[key] === input) {
      return config.value;
    }
  }
  return 0; // Default fallback
}

/**
 * Get next Sunday from a given date
 */
export function getNextSunday(fromDate: Date): Date {
  const date = new Date(fromDate);
  date.setDate(date.getDate() + ((7 - date.getDay()) % 7));
  return date;
}

/**
 * Get Wednesday before a Sunday
 */
export function getWednesdayBeforeSunday(sunday: Date): Date {
  const date = new Date(sunday);
  date.setDate(date.getDate() - 4); // Sunday - 4 days = Wednesday
  return date;
}

/**
 * Normalize sport type from workout
 */
function normalizeSport(workout: any, sportType: string): boolean {
  const workoutType = (workout.WorkoutType || '').toLowerCase();
  
  if (sportType === 'bike') {
    return workoutType === 'bike';
  } else if (sportType === 'run') {
    return workoutType === 'run';
  }
  
  return false;
}

/**
 * Main TSS Recommendation Calculation
 */
export async function calculateTSSRecommendation(
  athleteId: string,
  sportType: 'bike' | 'run',
  blockType: string,
  keyWorkouts: string,
  soreness: string,
  moodIrritability: string,
  sleep: string,
  hrvRhr: string,
  motivation: string,
  lifeStress: string,
  orthopedicFlags: string | null,
  workouts: any[]
): Promise<{
  status: string;
  ctl: number;
  atl: number;
  wtsb: number;
  echo_estimate: number;
  eow_tsb: number;
  tsb_slope_5d: number;
  atl_ctl_ratio: number;
  overall_score: number;
  recommendation: string;
  percentage_change: number;
  coming_sunday: string;
  mid_week_wednesday: string;
  orthopedic_score?: number;
  low_change: number;
  high_change: number;
}> {
  // Validate sport and block type
  if (!(sportType in BLOCK_CONFIGS)) {
    throw new Error('Invalid sport type');
  }
  
  const sportConfig = BLOCK_CONFIGS[sportType];
  if (!(blockType in sportConfig)) {
    throw new Error(`Invalid block type for sport: ${sportType}`);
  }
  
  const config = sportConfig[blockType];
  
  // Calculate key dates
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const comingSunday = getNextSunday(today);
  const midWeekWednesday = getWednesdayBeforeSunday(comingSunday);
  
  // Calculate fetch range
  const fetchFrom = new Date(today);
  fetchFrom.setDate(fetchFrom.getDate() - HISTORY_DAYS);
  
  const fetchTo = comingSunday;
  
  console.log(`📊 TSS Calculation for ${athleteId} (${sportType}/${blockType})`);
  console.log(`   Date Range: ${fetchFrom.toISOString().split('T')[0]} to ${fetchTo.toISOString().split('T')[0]}`);
  console.log(`   Total Workouts: ${workouts.length}`);
  
  // Aggregate TSS data by day
  const dailyTSS: Record<string, { actual: number; planned: number }> = {};
  
  for (const workout of workouts) {
    try {
      const workoutDay = workout.WorkoutDay;
      if (!workoutDay) continue;
      
      const dayStr = workoutDay.split('T')[0];
      const workoutDate = new Date(dayStr);
      
      // Filter by date range
      if (workoutDate < fetchFrom || workoutDate > fetchTo) continue;
      
      // Filter by sport type
      if (!normalizeSport(workout, sportType)) continue;
      
      const tssActual = parseFloat(workout.TssActual || 0);
      const tssPlanned = parseFloat(workout.TssPlanned || 0);
      const completed = workout.Completed === true;
      
      if (!dailyTSS[dayStr]) {
        dailyTSS[dayStr] = { actual: 0, planned: 0 };
      }
      
      if (completed) {
        dailyTSS[dayStr].actual += tssActual;
        dailyTSS[dayStr].planned += tssPlanned;
      } else {
        dailyTSS[dayStr].planned += tssPlanned;
      }
    } catch (err) {
      console.error('   Error processing workout:', err);
      continue;
    }
  }
  
  // Build daily TSS series
  const allDays: Date[] = [];
  const tssValues: number[] = [];
  
  let currentDate = new Date(fetchFrom);
  while (currentDate <= fetchTo) {
    allDays.push(new Date(currentDate));
    
    const dayStr = currentDate.toISOString().split('T')[0];
    const entry = dailyTSS[dayStr] || { actual: 0, planned: 0 };
    
    // Use actual TSS for past days, planned TSS for future days
    const tssValue = currentDate < today ? entry.actual : entry.planned;
    tssValues.push(tssValue);
    
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  console.log(`   TSS Values: ${tssValues.length} days, Total TSS: ${tssValues.reduce((a, b) => a + b, 0)}`);
  
  // Calculate CTL / ATL / TSB using EWMA
  const ctlValues = ewma(tssValues, CTL_TAU, true);
  const atlValues = ewma(tssValues, ATL_TAU, true);
  
  const tsbValues: (number | null)[] = [null];
  for (let i = 1; i < ctlValues.length; i++) {
    tsbValues.push(ctlValues[i - 1] - atlValues[i - 1]);
  }
  
  // Extract Sunday and Wednesday values
  const sundayIdx = Math.floor((comingSunday.getTime() - fetchFrom.getTime()) / (1000 * 60 * 60 * 24));
  const wednesdayIdx = Math.floor((midWeekWednesday.getTime() - fetchFrom.getTime()) / (1000 * 60 * 60 * 24));
  
  const ctlSunday = ctlValues[sundayIdx] || 0;
  const atlSunday = atlValues[sundayIdx] || 0;
  const wtsb = (wednesdayIdx >= 0 && wednesdayIdx < tsbValues.length) ? (tsbValues[wednesdayIdx] || 0) : 0;
  
  console.log(`   CTL (Sunday): ${ctlSunday.toFixed(2)}`);
  console.log(`   ATL (Sunday): ${atlSunday.toFixed(2)}`);
  console.log(`   TSB (Wednesday): ${wtsb.toFixed(2)}`);
  
  // Derived metrics
  const echoEstimate = (7 * ctlSunday) / 0.965;
  const eowTsb = ctlSunday - atlSunday;
  const tsbSlope5d = (wtsb - eowTsb) / 5;
  const atlCtlRatio = ctlSunday !== 0 ? atlSunday / ctlSunday : 0;
  
  console.log(`   Echo Estimate: ${echoEstimate.toFixed(2)}`);
  console.log(`   ATL/CTL Ratio: ${atlCtlRatio.toFixed(4)}`);
  console.log(`   TSB Slope (5d): ${tsbSlope5d.toFixed(2)}`);
  
  // Calculate component scores
  const atlCtlScore = findScoreInRange(atlCtlRatio, config.atl_ctl_ratio);
  const tsbTrendScore = findScoreInRange(tsbSlope5d, config["5_day_tsb_trend"]);
  const eowTsbScore = findScoreInRange(eowTsb, config.EowTSB);
  const workoutExecutionScore = findScoreByString(keyWorkouts, config.workout_execution, 'we_str');
  
  console.log(`   Scores: ATL/CTL=${atlCtlScore}, TSB Trend=${tsbTrendScore}, EoW TSB=${eowTsbScore}, Workout Exec=${workoutExecutionScore}`);
  
  // Subjective metrics
  const subjectiveTotal =
    (COMMON_OPTIONS[soreness] || 0) +
    (COMMON_OPTIONS[moodIrritability] || 0) +
    (COMMON_OPTIONS[sleep] || 0) +
    (COMMON_OPTIONS[hrvRhr] || 0) +
    (COMMON_OPTIONS[motivation] || 0);
  
  const subjectiveScore = findScoreInRange(subjectiveTotal, config.subjective_scoring);
  
  // Life stress
  const lifeStressScore = findScoreByString(lifeStress, config.life_stress_scoring, 'ls_str');
  
  console.log(`   Subjective: Total=${subjectiveTotal}, Score=${subjectiveScore}, Life Stress=${lifeStressScore}`);
  
  // Orthopedic flags (Run only)
  let orthopedicScore = 0;
  if (sportType === 'run' && orthopedicFlags && config.orthopedic_flags_scoring) {
    orthopedicScore = findScoreByString(orthopedicFlags, config.orthopedic_flags_scoring, 'of_str');
    console.log(`   Orthopedic Score: ${orthopedicScore}`);
  }
  
  // Calculate overall score
  const overallScore =
    atlCtlScore +
    tsbTrendScore +
    eowTsbScore +
    workoutExecutionScore +
    subjectiveScore +
    lifeStressScore +
    orthopedicScore;
  
  console.log(`   ⭐ Overall Score: ${overallScore}`);
  
  // Find recommendation
  const recommendationData = config.training_stress_recommendation_scale.find(
    rec => overallScore >= rec.low && overallScore <= rec.high
  );
  
  if (!recommendationData) {
    throw new Error('Could not determine recommendation from score');
  }
  
  console.log(`   📈 Recommendation: ${recommendationData.recommendation}`);
  
  // Calculate percentage change
  const lowChange = recommendationData.low_change;
  const highChange = recommendationData.high_change;
  const percentageChange = ((lowChange + highChange) / 2) - 1;
  
  return {
    status: 'ok',
    ctl: Math.round(ctlSunday),
    atl: Math.round(atlSunday),
    wtsb: Math.round(wtsb),
    echo_estimate: Math.round(echoEstimate),
    eow_tsb: Math.round(eowTsb),
    tsb_slope_5d: Math.round(tsbSlope5d),
    atl_ctl_ratio: parseFloat(atlCtlRatio.toFixed(4)),
    overall_score: Math.round(overallScore),
    recommendation: recommendationData.recommendation,
    percentage_change: Math.round(percentageChange * 100),
    coming_sunday: comingSunday.toISOString().split('T')[0],
    mid_week_wednesday: midWeekWednesday.toISOString().split('T')[0],
    orthopedic_score: sportType === 'run' ? orthopedicScore : undefined,
    low_change: lowChange,
    high_change: highChange,
  };
}
