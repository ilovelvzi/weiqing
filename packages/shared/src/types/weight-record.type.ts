import type { Mood, RecordSource } from "../enums";

export interface WeightRecordDto {
  id: string;
  weightKg: number;
  localDate: string;
  timezone: string;
  mood: Mood | null;
  note: string | null;
  source: RecordSource;
  recordedAt: string;
  createdAt: string;
  updatedAt: string;
}
