import type { AiTone } from "@weiqing/shared";
import { StyleSheet, Text, View } from "react-native";
import { Card } from "../../../components/base";
import { colors, radius, spacing, typography } from "../../../styles";

export interface EncouragementCardData {
  id?: string;
  weightRecordId?: string;
  title: string;
  message: string;
  tone: AiTone | string;
  tags?: string[];
  generatedAt?: string;
}

interface EncouragementCardProps {
  encouragement?: EncouragementCardData | null;
  fallbackMessage?: string;
  fallbackTitle?: string;
}

export function EncouragementCard({
  encouragement,
  fallbackMessage = "Keep this as a small, steady check-in. No pressure, just one clear note for today.",
  fallbackTitle = "A gentle note"
}: EncouragementCardProps) {
  const title = encouragement?.title ?? fallbackTitle;
  const message = encouragement?.message ?? fallbackMessage;
  const tags = encouragement?.tags?.slice(0, 4) ?? ["steady"];

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Encouragement</Text>
        <Text style={styles.title}>{title}</Text>
      </View>
      <Text style={styles.message}>{message}</Text>
      <View style={styles.tags}>
        {tags.map((tag) => (
          <View key={tag} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.md
  },
  eyebrow: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: "700",
    textTransform: "uppercase"
  },
  header: {
    gap: spacing.xs
  },
  message: {
    ...typography.body,
    color: colors.textSecondary
  },
  tag: {
    backgroundColor: colors.primaryLight,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs
  },
  tagText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: "600"
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  title: {
    ...typography.cardTitle,
    color: colors.text
  }
});
