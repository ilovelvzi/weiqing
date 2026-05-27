import type { RecordsViewMode } from "../../../stores";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing, typography } from "../../../styles";

interface RecordsHeaderProps {
  viewMode: RecordsViewMode;
  onChangeViewMode: (viewMode: RecordsViewMode) => void;
}

export function RecordsHeader({ onChangeViewMode, viewMode }: RecordsHeaderProps) {
  return (
    <View style={styles.segment}>
      <SegmentButton
        label="List"
        onPress={() => onChangeViewMode("list")}
        selected={viewMode === "list"}
      />
      <SegmentButton
        label="Calendar"
        onPress={() => onChangeViewMode("calendar")}
        selected={viewMode === "calendar"}
      />
    </View>
  );
}

function SegmentButton({
  label,
  onPress,
  selected
}: {
  label: string;
  onPress: () => void;
  selected: boolean;
}) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={[styles.button, selected && styles.selected]}>
      <Text style={[styles.label, selected && styles.selectedLabel]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    borderRadius: radius.pill,
    flex: 1,
    minHeight: 40,
    justifyContent: "center"
  },
  label: {
    ...typography.subheadline,
    color: colors.textSecondary,
    fontWeight: "700"
  },
  segment: {
    backgroundColor: colors.surfaceLow,
    borderRadius: radius.pill,
    flexDirection: "row",
    gap: spacing.xs,
    padding: spacing.xs
  },
  selected: {
    backgroundColor: colors.surface
  },
  selectedLabel: {
    color: colors.primary
  }
});
