import type { PropsWithChildren } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../styles";

export interface SafeAreaViewProps extends PropsWithChildren {
  style?: StyleProp<ViewStyle>;
}

export function SafeAreaView({ children, style }: SafeAreaViewProps) {
  return (
    <RNSafeAreaView style={[{ flex: 1, backgroundColor: colors.background }, style]}>
      {children}
    </RNSafeAreaView>
  );
}
