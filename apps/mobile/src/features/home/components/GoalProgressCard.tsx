import { StyleSheet, Text, View } from "react-native";
import { Card } from "../../../components/base";
import { colors, radius, spacing, typography } from "../../../styles";
import { formatWeightKg } from "../../../utils";

interface GoalProgressCardProps {
  currentWeightKg?: number | null;
  targetWeightKg?: number | null;
}

export function GoalProgressCard({ currentWeightKg, targetWeightKg }: GoalProgressCardProps) {
  const diffKg =
    typeof currentWeightKg === "number" && typeof targetWeightKg === "number"
      ? currentWeightKg - targetWeightKg
      : null;
  const progress = resolveProgress(diffKg);

  return (
    <Card style={styles.card}>
      <View style={styles.row}>
        <View>
          <Text style={styles.label}>Goal</Text>
          <Text style={styles.title}>
            {diffKg === null ? "Set a target when ready" : `${Math.abs(diffKg).toFixed(1)} kg to target`}
          </Text>
        </View>
        <Text style={styles.target}>{formatWeightKg(targetWeightKg)}</Text>
      </View>

      <View style={styles.track}>
        <View style={[styles.fill, { width: `${progress}%` as `${number}%` }]} />
      </View>
    </Card>
  );
}

function resolveProgress(diffKg: number | null): number {
  if (diffKg === null) {
    return 16;
  }

  if (diffKg <= 0) {
    return 100;
  }

  return Math.max(18, Math.min(92, 100 - diffKg * 8));
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.md
  },
  fill: {
    backgroundColor: colors.primary,
    borderRadius: radius.pill,
    height: "100%"
  },
  label: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: "700",
    textTransform: "uppercase"
  },
  row: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.md,
    justifyContent: "space-between"
  },
  target: {
    ...typography.subheadline,
    color: colors.textSecondary,
    fontWeight: "600"
  },
  title: {
    ...typography.cardTitle,
    color: colors.text,
    marginTop: spacing.xs
  },
  track: {
    backgroundColor: colors.surfaceContainer,
    borderRadius: radius.pill,
    height: 10,
    overflow: "hidden"
  }
});
