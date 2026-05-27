import type { WeightRecordDto } from "@weiqing/shared";
import { StyleSheet, Text, View } from "react-native";
import { Card } from "../../../components/base";
import { colors, spacing, typography } from "../../../styles";
import { formatWeightKg } from "../../../utils";

interface TodayWeightCardProps {
  todayRecord: WeightRecordDto | null;
  currentWeightKg?: number | null;
}

export function TodayWeightCard({ currentWeightKg, todayRecord }: TodayWeightCardProps) {
  const weightKg = todayRecord?.weightKg ?? currentWeightKg ?? null;

  return (
    <Card style={styles.card}>
      <View>
        <Text style={styles.label}>Today</Text>
        <Text style={styles.weight}>{formatWeightKg(weightKg)}</Text>
      </View>
      <Text style={styles.description}>
        {todayRecord ? `Recorded on ${todayRecord.localDate}` : "No check-in yet today."}
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.md
  },
  description: {
    ...typography.subheadline,
    color: colors.textSecondary
  },
  label: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: "700",
    textTransform: "uppercase"
  },
  weight: {
    ...typography.largeTitle,
    color: colors.text,
    marginTop: spacing.xs
  }
});
