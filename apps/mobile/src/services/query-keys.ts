export const queryKeys = {
  me: () => ["me"] as const,
  homeOverview: () => ["home", "overview"] as const,
  weightRecords: (params?: unknown) => ["weight-records", params] as const,
  weightRecordDetail: (id: string) => ["weight-records", id] as const,
  weightCalendar: (year: number, month: number) => ["weight-records", "calendar", year, month] as const,
  statsSummary: () => ["stats", "summary"] as const,
  statsTrend: (range: string) => ["stats", "trend", range] as const,
  latestEncouragement: () => ["ai", "encouragements", "latest"] as const
};
