import type { ViewStyle } from "react-native";

export const colors = {
  background: "#f9f9ff",
  surface: "#ffffff",
  surfaceLow: "#f0f3ff",
  surfaceContainer: "#e7eefe",
  primary: "#205fa5",
  primarySoft: "#7eb3ff",
  primaryLight: "#d4e3ff",
  secondary: "#3d6751",
  secondaryLight: "#bfedd1",
  warning: "#fedfa3",
  danger: "#ba1a1a",
  text: "#151c27",
  textSecondary: "#424751",
  outline: "#c2c6d2",
  separator: "rgba(21, 28, 39, 0.08)"
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  page: 20
};

export const typography = {
  largeTitle: {
    fontSize: 34,
    lineHeight: 41,
    fontWeight: "700"
  },
  title: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "700"
  },
  cardTitle: {
    fontSize: 20,
    lineHeight: 25,
    fontWeight: "700"
  },
  body: {
    fontSize: 17,
    lineHeight: 22
  },
  subheadline: {
    fontSize: 15,
    lineHeight: 20
  },
  caption: {
    fontSize: 13,
    lineHeight: 18
  }
} as const;

export const cardShadow: ViewStyle = {
  shadowColor: colors.primary,
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.04,
  shadowRadius: 24,
  elevation: 1
};
