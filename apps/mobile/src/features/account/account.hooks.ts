import { useMutation } from "@tanstack/react-query";
import { accountApi } from "./account.api";

export function useRequestDeleteAccountMutation() {
  return useMutation({ mutationFn: accountApi.requestDelete });
}

export function useCancelDeleteAccountMutation() {
  return useMutation({ mutationFn: accountApi.cancelDelete });
}
