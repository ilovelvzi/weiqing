import { StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing, typography } from "../../styles";

export function ErrorView({ message = "Something went wrong" }: { message?: string }) {
  return (
    <View style={styles.feedback}>
      <Text style={styles.title}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  feedback: {
    backgroundColor: colors.surface,
    borderColor: "rgba(186, 26, 26, 0.2)",
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    padding: spacing.lg
  },
  title: {
    ...typography.body,
    color: colors.danger,
    fontWeight: "600",
    textAlign: "center"
  }
});
