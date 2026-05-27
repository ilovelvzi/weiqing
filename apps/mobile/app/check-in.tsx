import { RecordSource } from "@weiqing/shared";
import { impactAsync, ImpactFeedbackStyle } from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, Card, Input } from "../src/components/base";
import { ErrorView } from "../src/components/feedback";
import { PageShell } from "../src/components/layout";
import { EncouragementCard } from "../src/features/ai/components";
import type { CreateWeightRecordResponse } from "../src/features/weight/weight.api";
import { useCreateWeightRecordMutation } from "../src/features/weight/weight.hooks";
import { CheckInSuccessCard, MoodSelector, WeightInputCard } from "../src/features/weight/components";
import { routes } from "../src/services";
import { useCheckinStore } from "../src/stores";
import { colors, spacing, typography } from "../src/styles";
import {
  getCurrentLocalDate,
  getCurrentTimezone,
  isValidWeightKg,
  parseWeightInput
} from "../src/utils";

export default function CheckInRoute() {
  const router = useRouter();
  const createWeightRecord = useCreateWeightRecordMutation();
  const draftWeight = useCheckinStore((state) => state.draftWeight);
  const draftMood = useCheckinStore((state) => state.draftMood);
  const draftNote = useCheckinStore((state) => state.draftNote);
  const isSuccessVisible = useCheckinStore((state) => state.isSuccessVisible);
  const setDraftWeight = useCheckinStore((state) => state.setDraftWeight);
  const setDraftMood = useCheckinStore((state) => state.setDraftMood);
  const setDraftNote = useCheckinStore((state) => state.setDraftNote);
  const showSuccess = useCheckinStore((state) => state.showSuccess);
  const resetDraft = useCheckinStore((state) => state.resetDraft);
  const [formError, setFormError] = useState<string | null>(null);
  const [result, setResult] = useState<CreateWeightRecordResponse | null>(null);

  async function handleSubmit() {
    setFormError(null);
    const weightKg = parseWeightInput(draftWeight);

    if (weightKg === null || !isValidWeightKg(weightKg)) {
      setFormError("Enter a weight between 20 and 300 kg.");
      return;
    }

    if (draftNote.length > 500) {
      setFormError("Keep the note under 500 characters.");
      return;
    }

    try {
      const response = await createWeightRecord.mutateAsync({
        weightKg,
        localDate: getCurrentLocalDate(),
        timezone: getCurrentTimezone(),
        mood: draftMood ?? undefined,
        note: draftNote.trim() || undefined,
        source: RecordSource.MANUAL
      });

      setResult(response);
      showSuccess();
      void impactAsync(ImpactFeedbackStyle.Light).catch(() => undefined);
    } catch (error) {
      setFormError(getErrorMessage(error, "Could not save this check-in. Please try again."));
    }
  }

  function handleBackHome() {
    resetDraft();
    router.replace(routes.home);
  }

  const successRecord = result?.record;

  return (
    <PageShell title="Check in" description="Save one clear note for today.">
      {isSuccessVisible && successRecord ? (
        <>
          <CheckInSuccessCard onBackHome={handleBackHome} record={successRecord} />
          <EncouragementCard
            encouragement={result?.encouragement ?? null}
            fallbackMessage="Saved for today. Let this record be information, not a judgment."
            fallbackTitle="Today is recorded"
          />
        </>
      ) : (
        <>
          <WeightInputCard onChangeText={setDraftWeight} value={draftWeight} />

          <Card style={styles.card}>
            <View style={styles.sectionHeader}>
              <Text style={styles.label}>Mood</Text>
              <Text style={styles.title}>Optional context</Text>
            </View>
            <MoodSelector onChange={setDraftMood} value={draftMood} />
          </Card>

          <Card style={styles.card}>
            <View style={styles.sectionHeader}>
              <Text style={styles.label}>Note</Text>
              <Text style={styles.title}>Anything to remember?</Text>
            </View>
            <Input
              multiline
              onChangeText={setDraftNote}
              placeholder="Sleep, cycle, workout, or just how today felt."
              style={styles.noteInput}
              value={draftNote}
            />
            <Text style={styles.counter}>{draftNote.length}/500</Text>
          </Card>

          {formError ? <ErrorView message={formError} /> : null}

          <Button disabled={createWeightRecord.isPending} onPress={handleSubmit}>
            {createWeightRecord.isPending ? "Saving..." : "Save check-in"}
          </Button>
        </>
      )}
    </PageShell>
  );
}

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback;
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.md
  },
  counter: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: "right"
  },
  label: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: "700",
    textTransform: "uppercase"
  },
  noteInput: {
    minHeight: 104,
    paddingTop: spacing.md,
    textAlignVertical: "top"
  },
  sectionHeader: {
    gap: spacing.xs
  },
  title: {
    ...typography.cardTitle,
    color: colors.text
  }
});
