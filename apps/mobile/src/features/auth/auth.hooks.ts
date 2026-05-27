import { useMutation, useQuery } from "@tanstack/react-query";
import { clearTokens, getRefreshToken, queryClient, queryKeys, setAccessToken, setRefreshToken } from "../../services";
import { useAuthStore } from "../../stores";
import { authApi, type AuthResponse } from "./auth.api";

export async function saveAuthSession(response: AuthResponse): Promise<void> {
  await setAccessToken(response.accessToken);
  await setRefreshToken(response.refreshToken);
  useAuthStore.getState().setAccessToken(response.accessToken);
  useAuthStore.getState().setAuthenticated(true);
  useAuthStore.getState().setBootstrapping(false);
  queryClient.setQueryData(queryKeys.me(), response.user);
}

export async function clearAuthSession(): Promise<void> {
  await clearTokens();
  queryClient.clear();
  useAuthStore.getState().resetAuth();
}

export function useRegisterMutation() {
  return useMutation({ mutationFn: authApi.register });
}

export function useLoginMutation() {
  return useMutation({ mutationFn: authApi.login });
}

export function useRefreshTokenMutation() {
  return useMutation({ mutationFn: authApi.refresh });
}

export function useLogoutMutation() {
  return useMutation({
    mutationFn: async () => {
      const refreshToken = await getRefreshToken();
      return authApi.logout({ refreshToken: refreshToken ?? undefined });
    },
    onSettled: () => {
      void clearAuthSession();
    }
  });
}

export function useCurrentUserQuery(enabled = true) {
  return useQuery({
    queryKey: queryKeys.me(),
    queryFn: authApi.getCurrentUser,
    enabled
  });
}
