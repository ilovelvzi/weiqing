import type { WeightRecordDto } from "@weiqing/shared";
import { StyleSheet, Text, View } from "react-native";
import { Button, Card } from "../../../components/base";
import { colors, spacing, typography } from "../../../styles";
import { formatWeightKg } from "../../../utils";

interface CheckInSuccessCardProps {
  record: WeightRecordDto;
  onBackHome: () => void;
}

export function CheckInSuccessCard({ onBackHome, record }: CheckInSuccessCardProps) {
  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.label}>Saved</Text>
        <Text style={styles.title}>{formatWeightKg(record.weightKg)}</Text>
        <Text style={styles.description}>Your {record.localDate} check-in is safely recorded.</Text>
      </View>
      <Button onPress={onBackHome}>Back to home</Button>
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
  header: {
    gap: spacing.xs
  },
  label: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: "700",
    textTransform: "uppercase"
  },
  title: {
    ...typography.largeTitle,
    color: colors.text
  }
});
