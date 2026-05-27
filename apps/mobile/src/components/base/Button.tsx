import type { PropsWithChildren } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { colors, radius, typography } from "../../styles";

export interface ButtonProps extends PropsWithChildren {
  disabled?: boolean;
  onPress?: () => void;
  variant?: "primary" | "secondary" | "ghost";
}

export function Button({ children, disabled, onPress, variant = "primary" }: ButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed
      ]}
    >
      <Text style={[styles.label, variant === "primary" ? styles.primaryLabel : styles.tintLabel]}>
        {children}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    borderRadius: radius.pill,
    justifyContent: "center",
    minHeight: 44,
    paddingHorizontal: 20
  },
  primary: {
    backgroundColor: colors.primary
  },
  secondary: {
    backgroundColor: colors.primaryLight
  },
  ghost: {
    backgroundColor: "transparent"
  },
  disabled: {
    opacity: 0.5
  },
  pressed: {
    opacity: 0.82
  },
  label: {
    ...typography.body,
    fontWeight: "600"
  },
  primaryLabel: {
    color: "#ffffff"
  },
  tintLabel: {
    color: colors.primary
  }
});
