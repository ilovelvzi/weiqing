import type { AiTone, AppTheme, CurrentUserDto, WeightUnit } from "@weiqing/shared";
import { apiClient } from "../../services";

export interface UpdateSettingsPayload {
  weightUnit?: WeightUnit;
  reminderEnabled?: boolean;
  reminderTime?: string | null;
  timezone?: string;
  theme?: AppTheme;
  aiTonePreference?: AiTone;
}

export const settingsApi = {
  updateSettings: (payload: UpdateSettingsPayload) =>
    apiClient.patch<CurrentUserDto, UpdateSettingsPayload>("/me/settings", payload)
};
