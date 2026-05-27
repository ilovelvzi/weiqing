import { useQuery } from "@tanstack/react-query";
import type { TrendRange } from "@weiqing/shared";
import { queryKeys } from "../../services";
import { statsApi } from "./stats.api";

export function useStatsSummaryQuery() {
  return useQuery({
    queryKey: queryKeys.statsSummary(),
    queryFn: statsApi.getSummary
  });
}

export function useStatsTrendQuery(range: TrendRange) {
  return useQuery({
    queryKey: queryKeys.statsTrend(range),
    queryFn: () => statsApi.getTrend(range)
  });
}

export const useWeightTrendQuery = useStatsTrendQuery;
