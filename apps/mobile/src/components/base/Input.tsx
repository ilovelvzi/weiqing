import { StyleSheet, TextInput, type TextInputProps } from "react-native";
import { colors, radius, spacing, typography } from "../../styles";

export function Input(props: TextInputProps) {
  return <TextInput placeholderTextColor={colors.textSecondary} style={styles.input} {...props} />;
}

const styles = StyleSheet.create({
  input: {
    ...typography.body,
    backgroundColor: colors.surface,
    borderColor: colors.outline,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    color: colors.text,
    minHeight: 44,
    paddingHorizontal: spacing.md
  }
});
