import type { HomeOverviewDto } from "@weiqing/shared";
import { apiClient } from "../../services";

export const homeApi = {
  getOverview: () => apiClient.get<HomeOverviewDto>("/home/overview")
};
