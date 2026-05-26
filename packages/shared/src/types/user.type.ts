import type { AccountDeletionStatus, AiTone, AppTheme, UserStatus, WeightUnit } from "../enums";

export interface CurrentUserDto {
  id: string;
  email: string;
  status: UserStatus;
  profile: UserProfileDto | null;
  settings: UserSettingsDto;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfileDto {
  nickname: string | null;
  gender: string | null;
  birthYear: number | null;
  heightCm: number | null;
  initialWeightKg: number | null;
  targetWeightKg: number | null;
  timezone: string;
}

export interface UserSettingsDto {
  preferredWeightUnit: WeightUnit;
  aiTonePreference: AiTone;
  appTheme: AppTheme;
  reminderEnabled: boolean;
  reminderTime: string | null;
  privacyModeEnabled: boolean;
  accountDeletionStatus: AccountDeletionStatus;
}
