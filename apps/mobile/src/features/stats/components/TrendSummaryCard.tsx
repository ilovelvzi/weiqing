import { StyleSheet, Text, View } from "react-native";
import { Card } from "../../../components/base";
import { colors, spacing, typography } from "../../../styles";
import { formatWeightKg } from "../../../utils";

interface TrendSummaryCardProps {
  startWeightKg?: number | null;
  endWeightKg?: number | null;
  minWeightKg?: number | null;
  maxWeightKg?: number | null;
  averageWeightKg?: number | null;
  changeKg?: number | null;
}

export function TrendSummaryCard({
  averageWeightKg,
  changeKg,
  endWeightKg,
  maxWeightKg,
  minWeightKg,
  startWeightKg
}: TrendSummaryCardProps) {
  return (
    <Card style={styles.card}>
      <Text style={styles.title}>Range summary</Text>
      <View style={styles.grid}>
        <Metric label="Start" value={formatWeightKg(startWeightKg)} />
        <Metric label="Current" value={formatWeightKg(endWeightKg)} />
        <Metric label="Change" value={formatSignedWeight(changeKg)} />
        <Metric label="Average" value={formatWeightKg(averageWeightKg)} />
        <Metric label="Low" value={formatWeightKg(minWeightKg)} />
        <Metric label="High" value={formatWeightKg(maxWeightKg)} />
      </View>
    </Card>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
    </View>
  );
}

function formatSignedWeight(value?: number | null): string {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return "-- kg";
  }

  return `${value > 0 ? "+" : ""}${value.toFixed(1)} kg`;
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.md
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  metric: {
    backgroundColor: colors.surfaceLow,
    borderRadius: 14,
    flexBasis: "48%",
    flexGrow: 1,
    gap: spacing.xs,
    padding: spacing.md
  },
  metricLabel: {
    ...typography.caption,
    color: colors.textSecondary
  },
  metricValue: {
    ...typography.subheadline,
    color: colors.text,
    fontWeight: "700"
  },
  title: {
    ...typography.cardTitle,
    color: colors.text
  }
});
