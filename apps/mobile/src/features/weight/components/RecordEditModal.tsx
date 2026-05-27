import { Mood, type WeightRecordDto } from "@weiqing/shared";
import { useEffect, useState } from "react";
import { Modal, StyleSheet, Text, View } from "react-native";
import { Button, Card, Input } from "../../../components/base";
import { ErrorView } from "../../../components/feedback";
import { colors, spacing, typography } from "../../../styles";
import { isValidWeightKg, parseWeightInput } from "../../../utils";
import { MoodSelector } from "./MoodSelector";

interface RecordEditModalProps {
  isPending: boolean;
  onClose: () => void;
  onSubmit: (payload: { weightKg: number; mood?: Mood | null; note?: string | null }) => void;
  record: WeightRecordDto | null;
  visible: boolean;
}

export function RecordEditModal({
  isPending,
  onClose,
  onSubmit,
  record,
  visible
}: RecordEditModalProps) {
  const [weight, setWeight] = useState("");
  const [mood, setMood] = useState<Mood | null>(null);
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (record) {
      setWeight(String(record.weightKg));
      setMood(record.mood);
      setNote(record.note ?? "");
      setError(null);
    }
  }, [record]);

  function handleSubmit() {
    const weightKg = parseWeightInput(weight);

    if (weightKg === null || !isValidWeightKg(weightKg)) {
      setError("Enter a weight between 20 and 300 kg.");
      return;
    }

    if (note.length > 500) {
      setError("Keep the note under 500 characters.");
      return;
    }

    onSubmit({
      weightKg,
      mood,
      note: note.trim() || null
    });
  }

  return (
    <Modal animationType="fade" onRequestClose={onClose} transparent visible={visible}>
      <View style={styles.overlay}>
        <Card style={styles.sheet}>
          <Text style={styles.title}>Edit record</Text>
          <Input keyboardType="decimal-pad" onChangeText={setWeight} placeholder="72.5" value={weight} />
          <MoodSelector onChange={setMood} value={mood} />
          <Input
            multiline
            onChangeText={setNote}
            placeholder="Optional note"
            style={styles.note}
            value={note}
          />
          {error ? <ErrorView message={error} /> : null}
          <View style={styles.actions}>
            <Button onPress={onClose} variant="ghost">Cancel</Button>
            <Button disabled={isPending} onPress={handleSubmit}>
              {isPending ? "Saving..." : "Save"}
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
  note: {
    minHeight: 96,
    paddingTop: spacing.md,
    textAlignVertical: "top"
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
