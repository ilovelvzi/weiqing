import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing, typography } from "../../styles";

export function Loading({ label = "Loading" }: { label?: string }) {
  return (
    <View style={styles.feedback}>
      <ActivityIndicator color={colors.primary} />
      <Text style={styles.title}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  feedback: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    gap: spacing.sm,
    padding: spacing.lg
  },
  title: {
    ...typography.body,
    color: colors.text,
    fontWeight: "600"
  }
});
