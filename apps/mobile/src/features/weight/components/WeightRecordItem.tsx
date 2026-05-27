import type { WeightRecordDto } from "@weiqing/shared";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Card } from "../../../components/base";
import { colors, radius, spacing, typography } from "../../../styles";
import { formatLocalDate, formatWeightKg } from "../../../utils";

interface WeightRecordItemProps {
  record: WeightRecordDto;
  onDelete: (record: WeightRecordDto) => void;
  onEdit: (record: WeightRecordDto) => void;
}

export function WeightRecordItem({ onDelete, onEdit, record }: WeightRecordItemProps) {
  return (
    <Card style={styles.card}>
      <View style={styles.row}>
        <View style={styles.main}>
          <Text style={styles.date}>{formatLocalDate(record.localDate)}</Text>
          <Text style={styles.weight}>{formatWeightKg(record.weightKg)}</Text>
          <View style={styles.metaRow}>
            {record.mood ? <Text style={styles.chip}>{record.mood}</Text> : null}
            {record.note ? <Text style={styles.chip}>Note</Text> : null}
          </View>
        </View>
        <View style={styles.actions}>
          <Action label="Edit" onPress={() => onEdit(record)} />
          <Action danger label="Delete" onPress={() => onDelete(record)} />
        </View>
      </View>
      {record.note ? <Text style={styles.note}>{record.note}</Text> : null}
    </Card>
  );
}

function Action({
  danger,
  label,
  onPress
}: {
  danger?: boolean;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.action}>
      <Text style={[styles.actionText, danger && styles.dangerText]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  action: {
    alignItems: "center",
    minHeight: 34,
    justifyContent: "center",
    paddingHorizontal: spacing.sm
  },
  actionText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: "700"
  },
  actions: {
    alignItems: "flex-end"
  },
  card: {
    gap: spacing.sm
  },
  chip: {
    ...typography.caption,
    backgroundColor: colors.primaryLight,
    borderRadius: radius.pill,
    color: colors.primary,
    fontWeight: "700",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs
  },
  dangerText: {
    color: colors.danger
  },
  date: {
    ...typography.caption,
    color: colors.textSecondary
  },
  main: {
    flex: 1,
    gap: spacing.xs
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  note: {
    ...typography.subheadline,
    color: colors.textSecondary
  },
  row: {
    alignItems: "flex-start",
    flexDirection: "row",
    gap: spacing.md
  },
  weight: {
    ...typography.cardTitle,
    color: colors.text
  }
});
