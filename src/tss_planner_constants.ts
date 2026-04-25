// Angela Engine v5.1 - TSS Planner Constants
// Ported from Echo-devo Python implementation

export const CTL_TAU = 42;
export const ATL_TAU = 7;
export const HISTORY_DAYS = 90;

export const COMMON_OPTIONS: Record<string, number> = {
  "no_issue": 0,
  "minor_issue": -1,
  "major_issue": -1.5,
  "unknown": -0.5,
};

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

interface BlockConfig {
  atl_ctl_ratio: RangeConfig[];
  "5_day_tsb_trend": RangeConfig[];
  EowTSB: RangeConfig[];
  workout_execution: StringConfig[];
  subjective_scoring: RangeConfig[];
  life_stress_scoring: StringConfig[];
  orthopedic_flags_scoring?: StringConfig[];
  training_stress_recommendation_scale: RecommendationScale[];
}

interface SportConfigs {
  bike: Record<string, BlockConfig>;
  run: Record<string, BlockConfig>;
}

export const BLOCK_CONFIGS: SportConfigs = {
  bike: {
    base_durability: {
      atl_ctl_ratio: [
        { value: 2, low: 0, high: 0.95 },
        { value: 1, low: 0.9501, high: 1.05 },
        { value: 0, low: 1.0501, high: 1.1 },
        { value: -1, low: 1.1001, high: 1.15 },
        { value: -2, low: 1.1501, high: 10 },
      ],
      "5_day_tsb_trend": [
        { value: 2, low: 1.501, high: 10 },
        { value: 1, low: 0.001, high: 1.5 },
        { value: 0, low: -1.5, high: 0 },
        { value: -1, low: -2.5, high: -1.501 },
        { value: -2, low: -10, high: -2.501 },
      ],
      EowTSB: [
        { value: 2, low: 5, high: 100 },
        { value: 1, low: 0, high: 4.999 },
        { value: 0, low: -5, high: -0.0001 },
        { value: -1, low: -15, high: -5.001 },
        { value: -2, low: -1000, high: -15.001 },
      ],
      workout_execution: [
        { value: 2, we_str: "fully_completed_rpe_low" },
        { value: 1, we_str: "fully_completed_as_intended" },
        { value: 0, we_str: "hit_or_miss_but_mostly_hit" },
        { value: -1, we_str: "hit_or_miss_but_mostly_miss" },
        { value: -2, we_str: "missed_multiple" },
      ],
      subjective_scoring: [
        { value: 1, low: -1, high: 0 },
        { value: 0, low: -2, high: -1.0001 },
        { value: -1, low: -3, high: -2.0001 },
        { value: -2, low: -100, high: -3.0001 },
      ],
      life_stress_scoring: [
        { value: 1, ls_str: "minimal" },
        { value: 0, ls_str: "normal" },
        { value: -1, ls_str: "moderate" },
        { value: -2, ls_str: "high" },
      ],
      training_stress_recommendation_scale: [
        { recommendation: "increase_a_lot", low: 7, high: 1000, low_change: 1.1, high_change: 1.15 },
        { recommendation: "increase_a_little", low: 0, high: 6, low_change: 1.05, high_change: 1.1 },
        { recommendation: "hold_steady", low: -3, high: -0.0001, low_change: 0.98, high_change: 1.02 },
        { recommendation: "decrease_a_little", low: -6, high: -4, low_change: 0.85, high_change: 0.95 },
        { recommendation: "decrease_a_lot", low: -1000, high: -7, low_change: 0.5, high_change: 0.7 },
      ],
    },
    build_th: {
      atl_ctl_ratio: [
        { value: 2, low: 0, high: 0.95 },
        { value: 1, low: 0.9501, high: 1.03 },
        { value: 0, low: 1.0301, high: 1.08 },
        { value: -1, low: 1.0801, high: 1.13 },
        { value: -2, low: 1.1301, high: 10 },
      ],
      "5_day_tsb_trend": [
        { value: 2, low: 1.501, high: 10 },
        { value: 1, low: 0.001, high: 1.5 },
        { value: 0, low: -1, high: 0 },
        { value: -1, low: -2, high: -1.001 },
        { value: -2, low: -10, high: -2.001 },
      ],
      EowTSB: [
        { value: 2, low: 5, high: 100 },
        { value: 1, low: 1, high: 4.99999 },
        { value: 0, low: -5, high: -0.99999 },
        { value: -1, low: -10, high: -5.00001 },
        { value: -2, low: -1000, high: -10.0001 },
      ],
      workout_execution: [
        { value: 2, we_str: "fully_completed_rpe_low" },
        { value: 1, we_str: "fully_completed_as_intended" },
        { value: 0, we_str: "hit_or_miss_but_mostly_hit" },
        { value: -1, we_str: "hit_or_miss_but_mostly_miss" },
        { value: -2, we_str: "missed_multiple" },
      ],
      subjective_scoring: [
        { value: 1, low: -1, high: 0 },
        { value: 0, low: -2, high: -1.0001 },
        { value: -1, low: -3, high: -2.0001 },
        { value: -2, low: -100, high: -3.0001 },
      ],
      life_stress_scoring: [
        { value: 1, ls_str: "minimal" },
        { value: 0, ls_str: "normal" },
        { value: -1, ls_str: "moderate" },
        { value: -2, ls_str: "high" },
      ],
      training_stress_recommendation_scale: [
        { recommendation: "increase_a_lot", low: 7, high: 1000, low_change: 1.08, high_change: 1.12 },
        { recommendation: "increase_a_little", low: 0, high: 6, low_change: 1.04, high_change: 1.08 },
        { recommendation: "hold_steady", low: -2, high: -0.0001, low_change: 0.97, high_change: 1.03 },
        { recommendation: "decrease_a_little", low: -5, high: -3, low_change: 0.85, high_change: 0.95 },
        { recommendation: "decrease_a_lot", low: -1000, high: -6, low_change: 0.6, high_change: 0.7 },
      ],
    },
    vo2_max: {
      atl_ctl_ratio: [
        { value: 2, low: 0, high: 0.95 },
        { value: 1, low: 0.9501, high: 1 },
        { value: 0, low: 1.0001, high: 1.04 },
        { value: -1, low: 1.0401, high: 1.08 },
        { value: -2, low: 1.0801, high: 10 },
      ],
      "5_day_tsb_trend": [
        { value: 2, low: 1.501, high: 10 },
        { value: 1, low: 0, high: 1.5 },
        { value: 0, low: -1, high: -0.00001 },
        { value: -1, low: -2, high: -1.001 },
        { value: -2, low: -10, high: -2.001 },
      ],
      EowTSB: [
        { value: 2, low: 5, high: 100 },
        { value: 1, low: 1, high: 4.99999 },
        { value: 0, low: -5, high: -0.99999 },
        { value: -1, low: -10, high: -5.00001 },
        { value: -2, low: -1000, high: -10.0001 },
      ],
      workout_execution: [
        { value: 2, we_str: "fully_completed_rpe_low" },
        { value: 1, we_str: "fully_completed_as_intended" },
        { value: 0, we_str: "hit_or_miss_but_mostly_hit" },
        { value: -1, we_str: "hit_or_miss_but_mostly_miss" },
        { value: -2, we_str: "missed_multiple" },
      ],
      subjective_scoring: [
        { value: 1, low: -1, high: 0 },
        { value: 0, low: -2, high: -1.0001 },
        { value: -1, low: -3, high: -2.0001 },
        { value: -2, low: -100, high: -3.0001 },
      ],
      life_stress_scoring: [
        { value: 1, ls_str: "minimal" },
        { value: 0, ls_str: "normal" },
        { value: -1, ls_str: "moderate" },
        { value: -2, ls_str: "high" },
      ],
      training_stress_recommendation_scale: [
        { recommendation: "slight_increase", low: 6, high: 1000, low_change: 1.03, high_change: 1.05 },
        { recommendation: "hold_to_slight_increase", low: 1, high: 5, low_change: 1, high_change: 1.03 },
        { recommendation: "hold_steady", low: -2, high: 0, low_change: 0.98, high_change: 1 },
        { recommendation: "decrease_a_little", low: -5, high: -3, low_change: 0.85, high_change: 0.95 },
        { recommendation: "decrease_a_lot", low: -1000, high: -6, low_change: 0.6, high_change: 0.75 },
      ],
    },
    specificity: {
      atl_ctl_ratio: [
        { value: 2, low: 0, high: 1 },
        { value: 1, low: 1.0001, high: 1.05 },
        { value: 0, low: 1.05001, high: 1.08 },
        { value: -1, low: 1.08001, high: 1.12 },
        { value: -2, low: 1.12001, high: 10 },
      ],
      "5_day_tsb_trend": [
        { value: 2, low: 1, high: 10 },
        { value: 1, low: 0, high: 0.9999 },
        { value: 0, low: -1, high: -0.00001 },
        { value: -1, low: -2, high: -1.001 },
        { value: -2, low: -100, high: -2.0001 },
      ],
      EowTSB: [
        { value: 2, low: 10, high: 100 },
        { value: 1, low: 3, high: 9.99999 },
        { value: 0, low: -3, high: 2.99999 },
        { value: -1, low: -100, high: -3.00001 },
      ],
      workout_execution: [
        { value: 2, we_str: "fully_completed_rpe_low" },
        { value: 1, we_str: "fully_completed_as_intended" },
        { value: 0, we_str: "hit_or_miss_but_mostly_hit" },
        { value: -1, we_str: "hit_or_miss_but_mostly_miss" },
        { value: -2, we_str: "missed_multiple" },
      ],
      subjective_scoring: [
        { value: 1, low: -1, high: 0 },
        { value: 0, low: -2, high: -1.0001 },
        { value: -1, low: -3, high: -2.0001 },
        { value: -2, low: -100, high: -3.0001 },
      ],
      life_stress_scoring: [
        { value: 1, ls_str: "minimal" },
        { value: 0, ls_str: "normal" },
        { value: -1, ls_str: "moderate" },
        { value: -2, ls_str: "high" },
      ],
      training_stress_recommendation_scale: [
        { recommendation: "slight_increase", low: 7, high: 1000, low_change: 1.03, high_change: 1.05 },
        { recommendation: "hold_to_slight_increase", low: 2, high: 6, low_change: 1, high_change: 1.03 },
        { recommendation: "hold_steady", low: -2, high: 1, low_change: 0.95, high_change: 0.99 },
        { recommendation: "decrease_a_little", low: -6, high: -3, low_change: 0.85, high_change: 0.95 },
        { recommendation: "decrease_a_lot", low: -1000, high: -7, low_change: 0.6, high_change: 0.75 },
      ],
    },
    hybrid: {
      atl_ctl_ratio: [
        { value: 2, low: 0, high: 0.95 },
        { value: 1, low: 0.9501, high: 1.015 },
        { value: 0, low: 1.01501, high: 1.06 },
        { value: -1, low: 1.0601, high: 1.105 },
        { value: -2, low: 1.10501, high: 10 },
      ],
      "5_day_tsb_trend": [
        { value: 2, low: 1.501, high: 10 },
        { value: 1, low: 0, high: 1.5 },
        { value: 0, low: -1, high: -0.00001 },
        { value: -1, low: -2, high: -0.9999 },
        { value: -2, low: -100, high: -2.0001 },
      ],
      EowTSB: [
        { value: 2, low: 5, high: 100 },
        { value: 1, low: 1, high: 4.99999 },
        { value: 0, low: -5, high: 0.99999 },
        { value: -1, low: -10, high: -5.00001 },
        { value: -2, low: -1000, high: -10.0001 },
      ],
      workout_execution: [
        { value: 2, we_str: "fully_completed_rpe_low" },
        { value: 1, we_str: "fully_completed_as_intended" },
        { value: 0, we_str: "hit_or_miss_but_mostly_hit" },
        { value: -1, we_str: "hit_or_miss_but_mostly_miss" },
        { value: -2, we_str: "missed_multiple" },
      ],
      subjective_scoring: [
        { value: 1, low: -1, high: 0 },
        { value: 0, low: -2, high: -1.0001 },
        { value: -1, low: -3, high: -2.0001 },
        { value: -2, low: -100, high: -3.0001 },
      ],
      life_stress_scoring: [
        { value: 1, ls_str: "minimal" },
        { value: 0, ls_str: "normal" },
        { value: -1, ls_str: "moderate" },
        { value: -2, ls_str: "high" },
      ],
      training_stress_recommendation_scale: [
        { recommendation: "increase_a_lot", low: 6, high: 1000, low_change: 1.055, high_change: 1.085 },
        { recommendation: "increase_a_little", low: 2, high: 5, low_change: 1.02, high_change: 1.055 },
        { recommendation: "hold_steady", low: -2, high: 1, low_change: 0.975, high_change: 1.015 },
        { recommendation: "decrease_a_little", low: -6, high: -3, low_change: 0.85, high_change: 0.95 },
        { recommendation: "decrease_a_lot", low: -1000, high: -7, low_change: 0.6, high_change: 0.725 },
      ],
    },
  },
  run: {
    base_durability: {
      atl_ctl_ratio: [
        { value: 2, low: 0, high: 1 },
        { value: 1, low: 1.0001, high: 1.08 },
        { value: 0, low: 1.0801, high: 1.12 },
        { value: -1, low: 1.1201, high: 1.16 },
        { value: -2, low: 1.1601, high: 10 },
      ],
      "5_day_tsb_trend": [
        { value: 2, low: 1, high: 10 },
        { value: 1, low: 0, high: 0.9999 },
        { value: 0, low: -1.5, high: -0.00001 },
        { value: -1, low: -2.5, high: -1.501 },
        { value: -2, low: -10, high: -2.501 },
      ],
      EowTSB: [
        { value: 2, low: 8, high: 100 },
        { value: 1, low: 2, high: 7.999 },
        { value: 0, low: -4, high: 1.999 },
        { value: -1, low: -8, high: -4.001 },
        { value: -2, low: -1000, high: -8.001 },
      ],
      workout_execution: [
        { value: 2, we_str: "fully_completed_rpe_low" },
        { value: 1, we_str: "fully_completed_as_intended" },
        { value: 0, we_str: "hit_or_miss_but_mostly_hit" },
        { value: -1, we_str: "hit_or_miss_but_mostly_miss" },
        { value: -2, we_str: "missed_multiple" },
      ],
      subjective_scoring: [
        { value: 1, low: -1, high: 0 },
        { value: 0, low: -2, high: -1.0001 },
        { value: -1, low: -3, high: -2.0001 },
        { value: -2, low: -100, high: -3.0001 },
      ],
      orthopedic_flags_scoring: [
        { value: 0, of_str: "no_issue" },
        { value: -1, of_str: "minor_issue" },
        { value: -3, of_str: "major_issue" },
      ],
      life_stress_scoring: [
        { value: 1, ls_str: "minimal" },
        { value: 0, ls_str: "normal" },
        { value: -1, ls_str: "moderate" },
        { value: -2, ls_str: "high" },
      ],
      training_stress_recommendation_scale: [
        { recommendation: "increase_a_lot", low: 7, high: 1000, low_change: 1.1, high_change: 1.15 },
        { recommendation: "increase_a_little", low: 0, high: 6, low_change: 1.05, high_change: 1.1 },
        { recommendation: "hold_steady", low: -3, high: -0.0001, low_change: 0.98, high_change: 1.02 },
        { recommendation: "decrease_a_little", low: -6, high: -4, low_change: 0.85, high_change: 0.95 },
        { recommendation: "decrease_a_lot", low: -1000, high: -7, low_change: 0.5, high_change: 0.7 },
      ],
    },
    build_th: {
      atl_ctl_ratio: [
        { value: 2, low: 0, high: 1 },
        { value: 1, low: 1.0001, high: 1.06 },
        { value: 0, low: 1.0601, high: 1.1 },
        { value: -1, low: 1.1001, high: 1.15 },
        { value: -2, low: 1.1501, high: 10 },
      ],
      "5_day_tsb_trend": [
        { value: 2, low: 0.5, high: 10 },
        { value: 1, low: -0.5, high: 0.4999 },
        { value: 0, low: -1.5, high: -0.50001 },
        { value: -1, low: -2.25, high: -1.5001 },
        { value: -2, low: -10, high: -2.2501 },
      ],
      EowTSB: [
        { value: 2, low: 10, high: 100 },
        { value: 1, low: 5, high: 9.99999 },
        { value: 0, low: -2, high: 4.99999 },
        { value: -1, low: -5, high: -2.00001 },
        { value: -2, low: -1000, high: -5.0001 },
      ],
      workout_execution: [
        { value: 2, we_str: "fully_completed_rpe_low" },
        { value: 1, we_str: "fully_completed_as_intended" },
        { value: 0, we_str: "hit_or_miss_but_mostly_hit" },
        { value: -1, we_str: "hit_or_miss_but_mostly_miss" },
        { value: -2, we_str: "missed_multiple" },
      ],
      subjective_scoring: [
        { value: 1, low: -1, high: 0 },
        { value: 0, low: -2, high: -1.0001 },
        { value: -1, low: -3, high: -2.0001 },
        { value: -2, low: -100, high: -3.0001 },
      ],
      orthopedic_flags_scoring: [
        { value: 0, of_str: "no_issue" },
        { value: -1, of_str: "minor_issue" },
        { value: -3, of_str: "major_issue" },
      ],
      life_stress_scoring: [
        { value: 1, ls_str: "minimal" },
        { value: 0, ls_str: "normal" },
        { value: -1, ls_str: "moderate" },
        { value: -2, ls_str: "high" },
      ],
      training_stress_recommendation_scale: [
        { recommendation: "increase_a_lot", low: 7, high: 1000, low_change: 1.1, high_change: 1.15 },
        { recommendation: "increase_a_little", low: 2, high: 6, low_change: 1.05, high_change: 1.1 },
        { recommendation: "hold_steady", low: -1, high: 1.9999, low_change: 1, high_change: 1.03 },
        { recommendation: "decrease_a_little", low: -4, high: -1.0001, low_change: 0.85, high_change: 0.95 },
        { recommendation: "decrease_a_lot", low: -1000, high: -4.0001, low_change: 0.6, high_change: 0.75 },
      ],
    },
    vo2_max: {
      atl_ctl_ratio: [
        { value: 2, low: 0, high: 0.95 },
        { value: 1, low: 0.9501, high: 1.05 },
        { value: -1, low: 1.05001, high: 10 },
      ],
      "5_day_tsb_trend": [
        { value: 2, low: 1.5, high: 10 },
        { value: 1, low: 0.5, high: 1.4999 },
        { value: 0, low: -1.5, high: 0.4999 },
        { value: -1, low: -2.5, high: -1.5001 },
        { value: -2, low: -10, high: -2.501 },
      ],
      EowTSB: [
        { value: 1, low: 8, high: 100 },
        { value: 0, low: 0, high: 7.99999 },
        { value: -1, low: -100, high: -0.0001 },
      ],
      workout_execution: [
        { value: 2, we_str: "fully_completed_rpe_low" },
        { value: 1, we_str: "fully_completed_as_intended" },
        { value: 0, we_str: "hit_or_miss_but_mostly_hit" },
        { value: -1, we_str: "hit_or_miss_but_mostly_miss" },
        { value: -2, we_str: "missed_multiple" },
      ],
      subjective_scoring: [
        { value: 1, low: -1, high: 0 },
        { value: 0, low: -2, high: -1.0001 },
        { value: -1, low: -3, high: -2.0001 },
        { value: -2, low: -100, high: -3.0001 },
      ],
      orthopedic_flags_scoring: [
        { value: 0, of_str: "no_issue" },
        { value: -1, of_str: "minor_issue" },
        { value: -3, of_str: "major_issue" },
      ],
      life_stress_scoring: [
        { value: 1, ls_str: "minimal" },
        { value: 0, ls_str: "normal" },
        { value: -1, ls_str: "moderate" },
        { value: -2, ls_str: "high" },
      ],
      training_stress_recommendation_scale: [
        { recommendation: "slight_increase", low: 6, high: 1000, low_change: 1.05, high_change: 1.08 },
        { recommendation: "hold_to_slight_increase", low: 2, high: 5, low_change: 1, high_change: 1.02 },
        { recommendation: "decrease_a_little", low: -1, high: 1, low_change: 0.93, high_change: 0.97 },
        { recommendation: "decrease_moderately", low: -4, high: -2, low_change: 0.83, high_change: 0.9 },
        { recommendation: "decrease_a_lot", low: -1000, high: -5, low_change: 0.6, high_change: 0.7 },
      ],
    },
    specificity: {
      atl_ctl_ratio: [
        { value: 2, low: 0, high: 1 },
        { value: 1, low: 1.0001, high: 1.1 },
        { value: -1, low: 1.1001, high: 10 },
      ],
      "5_day_tsb_trend": [
        { value: 2, low: 0.5, high: 10 },
        { value: 1, low: 0, high: 0.4999 },
        { value: -2, low: -1000, high: -0.00001 },
      ],
      EowTSB: [
        { value: 1, low: 5, high: 100 },
        { value: 0, low: -3, high: 4.999 },
        { value: -1, low: -1000, high: -3.0001 },
      ],
      workout_execution: [
        { value: 2, we_str: "fully_completed_rpe_low" },
        { value: 1, we_str: "fully_completed_as_intended" },
        { value: 0, we_str: "hit_or_miss_but_mostly_hit" },
        { value: -1, we_str: "hit_or_miss_but_mostly_miss" },
        { value: -2, we_str: "missed_multiple" },
      ],
      subjective_scoring: [
        { value: 1, low: -1, high: 0 },
        { value: 0, low: -2, high: -1.0001 },
        { value: -1, low: -3, high: -2.0001 },
        { value: -2, low: -100, high: -3.0001 },
      ],
      orthopedic_flags_scoring: [
        { value: 0, of_str: "no_issue" },
        { value: -1, of_str: "minor_issue" },
        { value: -3, of_str: "major_issue" },
      ],
      life_stress_scoring: [
        { value: 1, ls_str: "minimal" },
        { value: 0, ls_str: "normal" },
        { value: -1, ls_str: "moderate" },
        { value: -2, ls_str: "high" },
      ],
      training_stress_recommendation_scale: [
        { recommendation: "slight_increase", low: 7, high: 1000, low_change: 1.05, high_change: 1.1 },
        { recommendation: "hold_steady", low: 1, high: 6, low_change: 1, high_change: 1.03 },
        { recommendation: "decrease_a_little", low: -3, high: 0, low_change: 0.9, high_change: 0.96 },
        { recommendation: "decrease_moderately", low: -5, high: -4, low_change: 0.83, high_change: 0.9 },
        { recommendation: "decrease_a_lot", low: -1000, high: -6, low_change: 0.6, high_change: 0.7 },
      ],
    },
    hybrid: {
      atl_ctl_ratio: [
        { value: 2, low: 0, high: 0.99 },
        { value: 1, low: 0.9901, high: 1.05 },
        { value: 0, low: 1.0501, high: 1.09 },
        { value: -1, low: 1.0901, high: 1.14 },
        { value: -2, low: 1.1401, high: 10 },
      ],
      "5_day_tsb_trend": [
        { value: 2, low: 0.8, high: 10 },
        { value: 1, low: -0.2, high: 0.7999 },
        { value: 0, low: -1.5, high: -0.20001 },
        { value: -1, low: -2.33, high: -1.5001 },
        { value: -2, low: -10, high: -2.3301 },
      ],
      EowTSB: [
        { value: 2, low: 9, high: 100 },
        { value: 1, low: 4.5, high: 8.99999 },
        { value: 0, low: -1.5, high: 4.49999 },
        { value: -1, low: -4.5, high: -1.49999 },
        { value: -2, low: -1000, high: -4.50001 },
      ],
      workout_execution: [
        { value: 2, we_str: "fully_completed_rpe_low" },
        { value: 1, we_str: "fully_completed_as_intended" },
        { value: 0, we_str: "hit_or_miss_but_mostly_hit" },
        { value: -1, we_str: "hit_or_miss_but_mostly_miss" },
        { value: -2, we_str: "missed_multiple" },
      ],
      subjective_scoring: [
        { value: 1, low: -1, high: 0 },
        { value: 0, low: -2, high: -1.0001 },
        { value: -1, low: -3, high: -2.0001 },
        { value: -2, low: -100, high: -3.0001 },
      ],
      life_stress_scoring: [
        { value: 1, ls_str: "minimal" },
        { value: 0, ls_str: "normal" },
        { value: -1, ls_str: "moderate" },
        { value: -2, ls_str: "high" },
      ],
      training_stress_recommendation_scale: [
        { recommendation: "increase_a_lot", low: 7, high: 1000, low_change: 1.1, high_change: 1.15 },
        { recommendation: "increase_a_little", low: 2, high: 6, low_change: 1.05, high_change: 1.1 },
        { recommendation: "hold_steady", low: -1, high: 1.9999, low_change: 1, high_change: 1.03 },
        { recommendation: "decrease_a_little", low: -4, high: -1.0001, low_change: 0.85, high_change: 0.95 },
        { recommendation: "decrease_a_lot", low: -1000, high: -4.0001, low_change: 0.6, high_change: 0.75 },
      ],
    },
  },
};

// Helper functions
export function findScoreInRange(value: number, ranges: RangeConfig[]): number {
  for (const range of ranges) {
    if (value >= range.low && value <= range.high) {
      return range.value;
    }
  }
  return 0;
}

export function findScoreByString(
  str: string,
  configs: StringConfig[],
  key: "we_str" | "ls_str" | "of_str"
): number {
  for (const config of configs) {
    if (config[key] === str) {
      return config.value;
    }
  }
  return 0;
}

// EWMA calculation
export function ewma(values: number[], tau: number, seedWithFirst: boolean = true): number[] {
  if (values.length === 0) return [];
  
  const result: number[] = [];
  let current = seedWithFirst ? values[0] : 0;
  
  for (const value of values) {
    current = current + (value - current) / tau;
    result.push(current);
  }
  
  return result;
}
