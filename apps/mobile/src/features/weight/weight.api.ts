import type {
  AiEncouragementDto,
  Mood,
  PaginatedResponse,
  RecordSource,
  WeightRecordDto
} from "@weiqing/shared";
import { apiClient } from "../../services";

export interface CreateWeightRecordPayload {
  weightKg: number;
  localDate: string;
  timezone: string;
  mood?: Mood;
  note?: string;
  source?: RecordSource;
}

export interface UpdateWeightRecordPayload {
  weightKg?: number;
  localDate?: string;
  timezone?: string;
  mood?: Mood | null;
  note?: string | null;
}

export interface CreateWeightRecordResponse {
  record: WeightRecordDto;
  encouragement: AiEncouragementDto | null;
  encouragementStatus: "ready" | "generating" | "failed" | "skipped";
}

export interface QueryWeightRecordsParams {
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
}

export interface CalendarWeightRecordsParams {
  year: number;
  month: number;
}

export interface WeightRecordCalendarResponse {
  year: number;
  month: number;
  records: Array<{
    localDate: string;
    weightKg: number;
    mood: Mood | null;
    hasNote: boolean;
  }>;
}

export const weightApi = {
  create: (payload: CreateWeightRecordPayload) =>
    apiClient.post<CreateWeightRecordResponse, CreateWeightRecordPayload>("/weight-records", payload),
  list: (params: QueryWeightRecordsParams = {}) => {
    const search = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        search.set(key, String(value));
      }
    });
    const query = search.toString();
    return apiClient.get<PaginatedResponse<WeightRecordDto>>(
      `/weight-records${query ? `?${query}` : ""}`
    );
  },
  calendar: ({ year, month }: CalendarWeightRecordsParams) =>
    apiClient.get<WeightRecordCalendarResponse>(`/weight-records/calendar?year=${year}&month=${month}`),
  detail: (id: string) => apiClient.get<{ record: WeightRecordDto }>(`/weight-records/${id}`),
  update: (id: string, payload: UpdateWeightRecordPayload) =>
    apiClient.patch<{ record: WeightRecordDto }, UpdateWeightRecordPayload>(
      `/weight-records/${id}`,
      payload
    ),
  delete: (id: string) => apiClient.delete<{ deleted: true }>(`/weight-records/${id}`)
};

export const listWeightRecords = weightApi.list;
export const getCalendarWeightRecords = (year: number, month: number) =>
  weightApi.calendar({ year, month });
export const updateWeightRecord = weightApi.update;
export const deleteWeightRecord = weightApi.delete;
