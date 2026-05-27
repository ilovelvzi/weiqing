import type { PropsWithChildren } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { cardShadow, colors, radius, spacing } from "../../styles";

export interface CardProps extends PropsWithChildren {
  style?: StyleProp<ViewStyle>;
}

export function Card({ children, style }: CardProps) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    ...cardShadow,
    backgroundColor: colors.surface,
    borderColor: colors.separator,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    padding: spacing.md
  }
});
