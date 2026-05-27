import { TrendRange } from "@weiqing/shared";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing, typography } from "../../../styles";

const ranges: Array<{ label: string; value: TrendRange }> = [
  { label: "7D", value: TrendRange.SEVEN_DAYS },
  { label: "30D", value: TrendRange.THIRTY_DAYS },
  { label: "90D", value: TrendRange.NINETY_DAYS }
];

interface TrendRangeTabsProps {
  value: TrendRange;
  onChange: (value: TrendRange) => void;
}

export function TrendRangeTabs({ onChange, value }: TrendRangeTabsProps) {
  return (
    <View style={styles.container}>
      {ranges.map((range) => {
        const selected = range.value === value;

        return (
          <Pressable
            accessibilityRole="button"
            key={range.value}
            onPress={() => onChange(range.value)}
            style={[styles.tab, selected && styles.selectedTab]}
          >
            <Text style={[styles.label, selected && styles.selectedLabel]}>{range.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surfaceLow,
    borderRadius: radius.pill,
    flexDirection: "row",
    gap: spacing.xs,
    padding: spacing.xs
  },
  label: {
    ...typography.subheadline,
    color: colors.textSecondary,
    fontWeight: "700"
  },
  selectedLabel: {
    color: colors.primary
  },
  selectedTab: {
    backgroundColor: colors.surface
  },
  tab: {
    alignItems: "center",
    borderRadius: radius.pill,
    flex: 1,
    minHeight: 40,
    justifyContent: "center"
  }
});
