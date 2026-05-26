import { z } from "zod";
import { MAX_WEIGHT_KG, MIN_WEIGHT_KG, NOTE_MAX_LENGTH } from "../constants";
import { Mood, RecordSource } from "../enums";
import { isValidLocalDate } from "../utils/date.util";

export const weightRecordSchema = z.object({
  weightKg: z.number().min(MIN_WEIGHT_KG).max(MAX_WEIGHT_KG),
  localDate: z.string().refine(isValidLocalDate, "localDate must be a real YYYY-MM-DD date"),
  timezone: z.string().min(1).max(80),
  mood: z.nativeEnum(Mood).optional(),
  note: z.string().max(NOTE_MAX_LENGTH).optional(),
  source: z.nativeEnum(RecordSource).default(RecordSource.MANUAL)
});

export type WeightRecordInput = z.infer<typeof weightRecordSchema>;
