import { TrendRange } from "../enums/trend-range.enum";

export const MIN_WEIGHT_KG = 20;
export const MAX_WEIGHT_KG = 300;
export const LB_TO_KG_FACTOR = 0.45359237;

export const WEIGHT_RANGE_KG = {
  min: MIN_WEIGHT_KG,
  max: MAX_WEIGHT_KG
} as const;

export const NOTE_MAX_LENGTH = 500;
export const AI_NOTE_MAX_LENGTH = 200;
export const NICKNAME_MAX_LENGTH = 24;

export const DEFAULT_TIMEZONE = "Asia/Shanghai";

export const DEFAULT_TREND_RANGES = [
  TrendRange.SEVEN_DAYS,
  TrendRange.THIRTY_DAYS,
  TrendRange.NINETY_DAYS
] as const;
