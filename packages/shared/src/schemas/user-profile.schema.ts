import { z } from "zod";
import { MAX_WEIGHT_KG, MIN_WEIGHT_KG, NICKNAME_MAX_LENGTH } from "../constants";

export const profileSchema = z.object({
  nickname: z.string().min(1).max(NICKNAME_MAX_LENGTH).nullable().optional(),
  gender: z.string().max(32).nullable().optional(),
  birthYear: z.number().int().min(1900).max(2100).nullable().optional(),
  heightCm: z.number().min(100).max(250).nullable().optional(),
  initialWeightKg: z.number().min(MIN_WEIGHT_KG).max(MAX_WEIGHT_KG).nullable().optional(),
  targetWeightKg: z.number().min(MIN_WEIGHT_KG).max(MAX_WEIGHT_KG).nullable().optional(),
  timezone: z.string().min(1).max(80).optional()
});

export type ProfileInput = z.infer<typeof profileSchema>;
