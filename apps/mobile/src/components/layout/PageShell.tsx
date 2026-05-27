import type { PropsWithChildren } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { colors, spacing, typography } from "../../styles";
import { SafeAreaView } from "./SafeAreaView";

export interface PageShellProps extends PropsWithChildren {
  title: string;
  description?: string;
}

export function PageShell({ title, description, children }: PageShellProps) {
  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          {description ? <Text style={styles.description}>{description}</Text> : null}
        </View>
        <View style={styles.body}>{children}</View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.page,
    paddingBottom: spacing.xl
  },
  header: {
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg
  },
  title: {
    ...typography.title,
    color: colors.text
  },
  description: {
    ...typography.subheadline,
    color: colors.textSecondary,
    marginTop: spacing.sm
  },
  body: {
    gap: spacing.md
  }
});
