import { StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing, typography } from "../../styles";

export function EmptyState({
  title = "No data yet",
  description
}: {
  title?: string;
  description?: string;
}) {
  return (
    <View style={styles.feedback}>
      <Text style={styles.title}>{title}</Text>
      {description ? <Text style={styles.description}>{description}</Text> : null}
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
  },
  description: {
    ...typography.subheadline,
    color: colors.textSecondary,
    textAlign: "center"
  }
});
