import { StyleSheet, Text, View } from "react-native";
import { Card } from "../../../components/base";
import { colors, radius, spacing, typography } from "../../../styles";
import { formatWeightKg } from "../../../utils";

interface TrendPoint {
  localDate: string;
  weightKg: number;
}

interface TrendPreviewCardProps {
  points: TrendPoint[];
}

export function TrendPreviewCard({ points }: TrendPreviewCardProps) {
  const preview = points.slice(-7);
  const latest = preview[preview.length - 1]?.weightKg ?? null;

  return (
    <Card style={styles.card}>
      <View style={styles.row}>
        <View>
          <Text style={styles.label}>Trend preview</Text>
          <Text style={styles.title}>{formatWeightKg(latest)}</Text>
        </View>
        <Text style={styles.caption}>{preview.length} records</Text>
      </View>

      <View style={styles.sparkline}>
        {preview.length > 0 ? (
          preview.map((point) => (
            <View key={point.localDate} style={styles.pointColumn}>
              <View style={[styles.point, { height: resolvePointHeight(point.weightKg, preview) }]} />
            </View>
          ))
        ) : (
          <Text style={styles.empty}>A short trend will appear after a few check-ins.</Text>
        )}
      </View>
    </Card>
  );
}

function resolvePointHeight(weightKg: number, points: TrendPoint[]): number {
  const weights = points.map((point) => point.weightKg);
  const min = Math.min(...weights);
  const max = Math.max(...weights);

  if (min === max) {
    return 28;
  }

  return 18 + ((weightKg - min) / (max - min)) * 34;
}

const styles = StyleSheet.create({
  caption: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: "600"
  },
  card: {
    gap: spacing.md
  },
  empty: {
    ...typography.subheadline,
    color: colors.textSecondary,
    textAlign: "center"
  },
  label: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: "700",
    textTransform: "uppercase"
  },
  point: {
    backgroundColor: colors.primarySoft,
    borderRadius: radius.pill,
    minHeight: 12,
    width: 8
  },
  pointColumn: {
    alignItems: "center",
    flex: 1,
    justifyContent: "flex-end"
  },
  row: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  sparkline: {
    alignItems: "flex-end",
    backgroundColor: colors.surfaceLow,
    borderRadius: radius.md,
    flexDirection: "row",
    gap: spacing.sm,
    minHeight: 72,
    padding: spacing.md
  },
  title: {
    ...typography.cardTitle,
    color: colors.text,
    marginTop: spacing.xs
  }
});
