import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../services";
import { homeApi } from "./home.api";

export function useHomeOverviewQuery() {
  return useQuery({
    queryKey: queryKeys.homeOverview(),
    queryFn: homeApi.getOverview
  });
}
