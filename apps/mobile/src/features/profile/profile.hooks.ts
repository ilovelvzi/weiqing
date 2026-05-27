import { useMutation, useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../services";
import { profileApi } from "./profile.api";

export function useMeQuery() {
  return useQuery({
    queryKey: queryKeys.me(),
    queryFn: profileApi.me
  });
}

export function useUpdateProfileMutation() {
  return useMutation({ mutationFn: profileApi.updateProfile });
}
