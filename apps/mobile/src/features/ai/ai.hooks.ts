import { useMutation, useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../services";
import { aiApi } from "./ai.api";

export function useLatestEncouragementQuery() {
  return useQuery({
    queryKey: queryKeys.latestEncouragement(),
    queryFn: aiApi.latest
  });
}

export function useGenerateEncouragementMutation() {
  return useMutation({ mutationFn: aiApi.generate });
}
