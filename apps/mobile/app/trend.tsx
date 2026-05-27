import React from "react";
import { View } from "react-native";
import { Button } from "../src/components/base";
import { ErrorView, Loading } from "../src/components/feedback";
import { PageShell } from "../src/components/layout";
import {
  TargetWeightCard,
  TrendEmptyState,
  TrendRangeTabs,
  TrendSummaryCard,
  WeightTrendChart
} from "../src/features/stats/components";
import { useStatsSummaryQuery, useWeightTrendQuery } from "../src/features/stats/stats.hooks";
import { useTrendStore } from "../src/stores";

export default function TrendRoute() {
  const selectedRange = useTrendStore((state) => state.selectedRange);
  const setSelectedRange = useTrendStore((state) => state.setSelectedRange);
  const summaryQuery = useStatsSummaryQuery();
  const trendQuery = useWeightTrendQuery(selectedRange);
  const points = trendQuery.data?.points ?? [];
  const rangeSummary = buildRangeSummary(points);

  return (
    <PageShell title="Trend" description="A light view of your recent pattern.">
      <TrendRangeTabs onChange={setSelectedRange} value={selectedRange} />

      {summaryQuery.isPending || trendQuery.isPending ? <Loading label="Loading trend" /> : null}

      {summaryQuery.isError || trendQuery.isError ? (
        <View>
          <ErrorView message="Could not load trend data." />
          <Button
            onPress={() => {
              void summaryQuery.refetch();
              void trendQuery.refetch();
            }}
            variant="secondary"
          >
            Try again
          </Button>
        </View>
      ) : null}

      {!summaryQuery.isPending && !trendQuery.isPending && points.length === 0 ? (
        <TrendEmptyState />
      ) : null}

      {points.length > 0 ? (
        <>
          <WeightTrendChart points={points} />
          <TrendSummaryCard {...rangeSummary} />
        </>
      ) : null}

      {summaryQuery.data ? (
        <TargetWeightCard
          currentWeightKg={summaryQuery.data.currentWeightKg}
          initialWeightKg={summaryQuery.data.initialWeightKg}
          streakDays={summaryQuery.data.streakDays}
          targetWeightKg={summaryQuery.data.targetWeightKg}
          totalRecords={summaryQuery.data.totalRecords}
        />
      ) : null}
    </PageShell>
  );
}

function buildRangeSummary(points: Array<{ localDate: string; weightKg: number }>) {
  if (points.length === 0) {
    return {
      averageWeightKg: null,
      changeKg: null,
      endWeightKg: null,
      maxWeightKg: null,
      minWeightKg: null,
      startWeightKg: null
    };
  }

  const weights = points.map((point) => point.weightKg);
  const startWeightKg = weights[0] ?? null;
  const endWeightKg = weights[weights.length - 1] ?? null;
  const averageWeightKg =
    weights.length > 0
      ? Math.round((weights.reduce((total, weight) => total + weight, 0) / weights.length) * 100) / 100
      : null;

  return {
    averageWeightKg,
    changeKg:
      typeof startWeightKg === "number" && typeof endWeightKg === "number"
        ? Math.round((endWeightKg - startWeightKg) * 100) / 100
        : null,
    endWeightKg,
    maxWeightKg: Math.max(...weights),
    minWeightKg: Math.min(...weights),
    startWeightKg
  };
}
