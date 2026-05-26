import { z } from "zod";
import { AiTone, AppTheme, WeightUnit } from "../enums";

export const settingsSchema = z.object({
  preferredWeightUnit: z.nativeEnum(WeightUnit).optional(),
  aiTonePreference: z.nativeEnum(AiTone).optional(),
  appTheme: z.nativeEnum(AppTheme).optional(),
  reminderEnabled: z.boolean().optional(),
  reminderTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/)
    .nullable()
    .optional(),
  privacyModeEnabled: z.boolean().optional()
});

export type SettingsInput = z.infer<typeof settingsSchema>;
