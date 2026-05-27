import type { WeightRecordDto } from "@weiqing/shared";
import { Modal, StyleSheet, Text, View } from "react-native";
import { Button, Card } from "../../../components/base";
import { colors, spacing, typography } from "../../../styles";
import { formatLocalDate, formatWeightKg } from "../../../utils";

interface DeleteConfirmModalProps {
  isPending: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  record: WeightRecordDto | null;
  visible: boolean;
}

export function DeleteConfirmModal({
  isPending,
  onCancel,
  onConfirm,
  record,
  visible
}: DeleteConfirmModalProps) {
  return (
    <Modal animationType="fade" onRequestClose={onCancel} transparent visible={visible}>
      <View style={styles.overlay}>
        <Card style={styles.sheet}>
          <Text style={styles.title}>Delete this record?</Text>
          <Text style={styles.description}>
            {record
              ? `${formatLocalDate(record.localDate)} - ${formatWeightKg(record.weightKg)}`
              : "This record will be removed from your history."}
          </Text>
          <View style={styles.actions}>
            <Button onPress={onCancel} variant="ghost">Keep it</Button>
            <Button disabled={isPending} onPress={onConfirm}>
              {isPending ? "Deleting..." : "Delete"}
            </Button>
          </View>
        </Card>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: "row",
    gap: spacing.sm,
    justifyContent: "flex-end"
  },
  description: {
    ...typography.body,
    color: colors.textSecondary
  },
  overlay: {
    backgroundColor: "rgba(21, 28, 39, 0.24)",
    flex: 1,
    justifyContent: "flex-end",
    padding: spacing.page
  },
  sheet: {
    gap: spacing.md
  },
  title: {
    ...typography.cardTitle,
    color: colors.text
  }
});
