import { WeightRecordDto } from "@weiqing/shared";
import { WeightRecordEntity } from "./entities";

export interface WeightRecordDetailDto {
  record: WeightRecordDto;
  encouragement: null;
}

export interface WeightRecordMutationDto {
  record: WeightRecordDto;
  encouragement: null;
  encouragementStatus: "skipped";
}

export interface WeightRecordUpdateDto {
  record: WeightRecordDto;
  encouragementRegenerated: false;
}

export interface WeightRecordCalendarItemDto {
  localDate: string;
  weightKg: number;
  mood: WeightRecordDto["mood"];
  hasNote: boolean;
}

export const toWeightRecordDto = (record: WeightRecordEntity): WeightRecordDto => ({
  id: record.id,
  weightKg: record.weightKg,
  localDate: record.localDate,
  timezone: record.timezone,
  mood: record.mood,
  note: record.note,
  source: record.source,
  recordedAt: record.recordedAt.toISOString(),
  createdAt: record.createdAt.toISOString(),
  updatedAt: record.updatedAt.toISOString()
});
