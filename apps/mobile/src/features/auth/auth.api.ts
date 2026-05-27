import type { CurrentUserDto } from "@weiqing/shared";
import { apiClient } from "../../services";

export interface AuthResponse {
  user: CurrentUserDto;
  accessToken: string;
  refreshToken: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  nickname?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
  deviceName?: string;
}

export interface RefreshTokenPayload {
  refreshToken: string;
}

export interface LogoutPayload {
  refreshToken?: string;
}

export const authApi = {
  register: (payload: RegisterPayload) => apiClient.post<AuthResponse, RegisterPayload>("/auth/register", payload),
  login: (payload: LoginPayload) => apiClient.post<AuthResponse, LoginPayload>("/auth/login", payload),
  refresh: (payload: RefreshTokenPayload) =>
    apiClient.post<AuthResponse, RefreshTokenPayload>("/auth/refresh", payload),
  logout: (payload: LogoutPayload) =>
    apiClient.post<{ loggedOut: true }, LogoutPayload>("/auth/logout", payload),
  getCurrentUser: () => apiClient.get<CurrentUserDto>("/me")
};
