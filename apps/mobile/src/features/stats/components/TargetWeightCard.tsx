import { StyleSheet, Text, View } from "react-native";
import { Card } from "../../../components/base";
import { colors, spacing, typography } from "../../../styles";
import { formatWeightKg } from "../../../utils";

interface TargetWeightCardProps {
  currentWeightKg?: number | null;
  initialWeightKg?: number | null;
  targetWeightKg?: number | null;
  streakDays?: number;
  totalRecords?: number;
}

export function TargetWeightCard({
  currentWeightKg,
  initialWeightKg,
  streakDays = 0,
  targetWeightKg,
  totalRecords = 0
}: TargetWeightCardProps) {
  return (
    <Card style={styles.card}>
      <Text style={styles.title}>Progress</Text>
      <View style={styles.row}>
        <Text style={styles.label}>Current</Text>
        <Text style={styles.value}>{formatWeightKg(currentWeightKg)}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Initial</Text>
        <Text style={styles.value}>{formatWeightKg(initialWeightKg)}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Target</Text>
        <Text style={styles.value}>{formatWeightKg(targetWeightKg)}</Text>
      </View>
      <View style={styles.statsRow}>
        <Text style={styles.badge}>{streakDays} day streak</Text>
        <Text style={styles.badge}>{totalRecords} records</Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  badge: {
    ...typography.caption,
    backgroundColor: colors.primaryLight,
    borderRadius: 999,
    color: colors.primary,
    fontWeight: "700",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs
  },
  card: {
    gap: spacing.md
  },
  label: {
    ...typography.subheadline,
    color: colors.textSecondary
  },
  row: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  statsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  title: {
    ...typography.cardTitle,
    color: colors.text
  },
  value: {
    ...typography.subheadline,
    color: colors.text,
    fontWeight: "700"
  }
});
