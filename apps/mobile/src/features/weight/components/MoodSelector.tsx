import { Mood } from "@weiqing/shared";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing, typography } from "../../../styles";

const moodOptions = [
  { label: "Calm", value: Mood.CALM },
  { label: "Happy", value: Mood.HAPPY },
  { label: "Tired", value: Mood.TIRED },
  { label: "Anxious", value: Mood.ANXIOUS },
  { label: "Neutral", value: Mood.NEUTRAL }
];

interface MoodSelectorProps {
  value: Mood | null;
  onChange: (value: Mood | null) => void;
}

export function MoodSelector({ onChange, value }: MoodSelectorProps) {
  return (
    <View style={styles.wrap}>
      {moodOptions.map((option) => {
        const selected = option.value === value;

        return (
          <Pressable
            accessibilityRole="button"
            key={option.value}
            onPress={() => onChange(selected ? null : option.value)}
            style={[styles.option, selected && styles.selected]}
          >
            <Text style={[styles.optionText, selected && styles.selectedText]}>{option.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  option: {
    backgroundColor: colors.surfaceLow,
    borderColor: "transparent",
    borderRadius: radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
  },
  optionText: {
    ...typography.subheadline,
    color: colors.textSecondary,
    fontWeight: "600"
  },
  selected: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary
  },
  selectedText: {
    color: colors.primary
  },
  wrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  }
});
