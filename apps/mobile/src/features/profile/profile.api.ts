import type { CurrentUserDto } from "@weiqing/shared";
import { apiClient } from "../../services";

export interface UpdateProfilePayload {
  nickname?: string | null;
  avatarUrl?: string | null;
  heightCm?: number | null;
  initialWeightKg?: number | null;
  targetWeightKg?: number | null;
  onboardingCompleted?: boolean;
}

export const profileApi = {
  me: () => apiClient.get<CurrentUserDto>("/me"),
  updateProfile: (payload: UpdateProfilePayload) =>
    apiClient.patch<CurrentUserDto, UpdateProfilePayload>("/me/profile", payload)
};
