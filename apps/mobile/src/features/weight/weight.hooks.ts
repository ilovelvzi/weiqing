import { useMutation, useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../services";
import type {
  CalendarWeightRecordsParams,
  QueryWeightRecordsParams,
  UpdateWeightRecordPayload
} from "./weight.api";
import { weightApi } from "./weight.api";

export function useWeightRecordsQuery(params: QueryWeightRecordsParams = {}) {
  return useQuery({
    queryKey: queryKeys.weightRecords(params),
    queryFn: () => weightApi.list(params)
  });
}

export function useWeightRecordDetailQuery(id: string) {
  return useQuery({
    queryKey: queryKeys.weightRecordDetail(id),
    queryFn: () => weightApi.detail(id),
    enabled: Boolean(id)
  });
}

export function useWeightCalendarQuery(params: CalendarWeightRecordsParams) {
  return useQuery({
    queryKey: queryKeys.weightCalendar(params.year, params.month),
    queryFn: () => weightApi.calendar(params)
  });
}

export function useCreateWeightRecordMutation() {
  return useMutation({ mutationFn: weightApi.create });
}

export function useUpdateWeightRecordMutation() {
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateWeightRecordPayload }) =>
      weightApi.update(id, payload)
  });
}

export function useDeleteWeightRecordMutation() {
  return useMutation({ mutationFn: weightApi.delete });
}
