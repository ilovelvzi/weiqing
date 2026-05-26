import type { TrendRange } from "../enums";

export interface StatsSummaryDto {
  currentWeightKg: number | null;
  initialWeightKg: number | null;
  targetWeightKg: number | null;
  minWeightKg: number | null;
  maxWeightKg: number | null;
  averageWeightKg: number | null;
  diffFromInitialKg: number | null;
  diffFromTargetKg: number | null;
  totalRecords: number;
  streakDays: number;
}

export interface WeightTrendPointDto {
  localDate: string;
  weightKg: number;
}

export interface WeightTrendResponseDto {
  range: TrendRange;
  points: WeightTrendPointDto[];
}
