import { useMutation } from "@tanstack/react-query";
import { authApi } from "./auth.api";

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
  return useMutation({ mutationFn: authApi.logout });
}
