/**
 * TRAININGPEAKS-EXACT CTL/ATL/TSB CALCULATION
 * Matches TrainingPeaks logic exactly as specified
 */

/**
 * Map TrainingPeaks activity types to sport buckets (EXACT TP MAPPING)
 */
function mapActivityToSport(activityType: string): 'run' | 'bike' | 'swim' | 'other' {
  const type = (activityType || '').toLowerCase().trim();
  
  // RUN SPORT BUCKET
  const runTypes = [
    'run', 'running',
    'treadmill', 'treadmill run',
    'trail', 'trail run', 'trail running',
    'track', 'track run',
    'ultra', 'ultra run',
    'hill repeats'
  ];
  
  // BIKE SPORT BUCKET
  const bikeTypes = [
    'bike', 'cycling', 'cycle',
    'road', 'road cycling', 'road bike',
    'indoor', 'indoor cycling', 'trainer', 'zwift', 'virtual ride',
    'mountain', 'mountain bike', 'mtb', 'mountain biking',
    'gravel', 'gravel bike', 'gravel ride',
    'cyclocross', 'cx',
    'time trial', 'tt',
    'criterium', 'crit'
  ];
  
  // SWIM SPORT BUCKET
  const swimTypes = [
    'swim', 'swimming',
    'pool', 'pool swim',
    'open water', 'open water swim', 'ows',
    'swim intervals'
  ];
  
  // Check each sport bucket
  for (const runType of runTypes) {
    if (type.includes(runType)) return 'run';
  }
  
  for (const bikeType of bikeTypes) {
    if (type.includes(bikeType)) return 'bike';
  }
  
  for (const swimType of swimTypes) {
    if (type.includes(swimType)) return 'swim';
  }
  
  return 'other';
}

/**
 * Calculate DAILY TSS per sport (Step 1 of TP calculation)
 * Groups workouts by date and sums TSS per sport per day
 */
function calculateDailyTSSBySport(workouts: any[]): Map<string, {run: number, bike: number, swim: number, all: number}> {
  const dailyTSS = new Map<string, {run: number, bike: number, swim: number, all: number}>();
  
  for (const workout of workouts) {
    if (!workout.Completed) continue;
    
    const date = workout.WorkoutDay?.split('T')[0];
    if (!date) continue;
    
    const tss = workout.TssActual || 0;
    if (tss === 0) continue;
    
    // Get or create daily bucket
    if (!dailyTSS.has(date)) {
      dailyTSS.set(date, { run: 0, bike: 0, swim: 0, all: 0 });
    }
    
    const dayBucket = dailyTSS.get(date)!;
    const sport = mapActivityToSport(workout.WorkoutType);
    
    // Add TSS to appropriate sport bucket
    if (sport === 'run') {
      dayBucket.run += tss;
    } else if (sport === 'bike') {
      dayBucket.bike += tss;
    } else if (sport === 'swim') {
      dayBucket.swim += tss;
    }
    // other sports NOT included in Combined PMC (per TP spec)
    
    // Add to combined (run + bike + swim only)
    if (sport !== 'other') {
      dayBucket.all += tss;
    }
  }
  
  return dailyTSS;
}

/**
 * Calculate CTL/ATL/TSB using EXACT TrainingPeaks exponential formula
 * Processes DAILY TSS (not per-workout)
 */
function calculateCTLATLTSBTrainingPeaksExact(workouts: any[], endDate: Date) {
  const CTL_TC = 42;  // CTL time constant (days)
  const ATL_TC = 7;   // ATL time constant (days)
  
  // Step 1: Calculate daily TSS by sport
  const dailyTSS = calculateDailyTSSBySport(workouts);
  
  // Step 2: Get all dates sorted chronologically
  const dates = Array.from(dailyTSS.keys()).sort();
  
  // If no workouts, return zeros
  if (dates.length === 0) {
    return {
      total: { ctl: 0, atl: 0, tsb: 0 },
      run: { ctl: 0, atl: 0, tsb: 0 },
      bike: { ctl: 0, atl: 0, tsb: 0 },
      swim: { ctl: 0, atl: 0, tsb: 0 }
    };
  }
  
  // Step 3: Initialize CTL/ATL for each sport
  let ctl_all = 0, atl_all = 0;
  let ctl_run = 0, atl_run = 0;
  let ctl_bike = 0, atl_bike = 0;
  let ctl_swim = 0, atl_swim = 0;
  
  // Step 4: Process each day chronologically up to endDate
  for (const date of dates) {
    const dateObj = new Date(date);
    if (dateObj > endDate) break;
    
    const day = dailyTSS.get(date)!;
    
    // Apply exponential weighted average formula (EXACT TP)
    // CTL[d] = CTL[d-1] + (TSS[d] - CTL[d-1]) / TC
    
    // Combined (ALL sports)
    ctl_all = ctl_all + (day.all - ctl_all) / CTL_TC;
    atl_all = atl_all + (day.all - atl_all) / ATL_TC;
    
    // Run
    ctl_run = ctl_run + (day.run - ctl_run) / CTL_TC;
    atl_run = atl_run + (day.run - atl_run) / ATL_TC;
    
    // Bike
    ctl_bike = ctl_bike + (day.bike - ctl_bike) / CTL_TC;
    atl_bike = atl_bike + (day.bike - atl_bike) / ATL_TC;
    
    // Swim
    ctl_swim = ctl_swim + (day.swim - ctl_swim) / CTL_TC;
    atl_swim = atl_swim + (day.swim - atl_swim) / ATL_TC;
  }
  
  // Step 5: Calculate TSB (CTL - ATL)
  return {
    total: {
      ctl: Math.round(ctl_all * 100) / 100,
      atl: Math.round(atl_all * 100) / 100,
      tsb: Math.round((ctl_all - atl_all) * 100) / 100
    },
    run: {
      ctl: Math.round(ctl_run * 100) / 100,
      atl: Math.round(atl_run * 100) / 100,
      tsb: Math.round((ctl_run - atl_run) * 100) / 100
    },
    bike: {
      ctl: Math.round(ctl_bike * 100) / 100,
      atl: Math.round(atl_bike * 100) / 100,
      tsb: Math.round((ctl_bike - atl_bike) * 100) / 100
    },
    swim: {
      ctl: Math.round(ctl_swim * 100) / 100,
      atl: Math.round(atl_swim * 100) / 100,
      tsb: Math.round((ctl_swim - atl_swim) * 100) / 100
    }
  };
}
