import type { AiEncouragementDto } from "./ai-encouragement.type";
import type { WeightRecordDto } from "./weight-record.type";

export interface HomeOverviewDto {
  todayRecord: WeightRecordDto | null;
  latestEncouragement: AiEncouragementDto | null;
  summary: {
    currentWeightKg: number | null;
    targetWeightKg: number | null;
    diffFromLastKg: number | null;
    streakDays: number;
    totalRecords: number;
  };
  trendPreview: Array<{
    localDate: string;
    weightKg: number;
  }>;
}
