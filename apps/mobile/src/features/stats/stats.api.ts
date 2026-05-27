import type { StatsSummaryDto, TrendRange, WeightTrendResponseDto } from "@weiqing/shared";
import { apiClient } from "../../services";

export const statsApi = {
  getSummary: () => apiClient.get<StatsSummaryDto>("/stats/summary"),
  getTrend: (range: TrendRange) =>
    apiClient.get<WeightTrendResponseDto>(`/stats/trend?range=${range}`)
};

export const getStatsSummary = statsApi.getSummary;
export const getWeightTrend = statsApi.getTrend;
