import { StyleSheet, Text, View } from "react-native";
import { Card, Input } from "../../../components/base";
import { colors, spacing, typography } from "../../../styles";

interface WeightInputCardProps {
  value: string;
  onChangeText: (value: string) => void;
}

export function WeightInputCard({ onChangeText, value }: WeightInputCardProps) {
  return (
    <Card style={styles.card}>
      <View>
        <Text style={styles.label}>Weight</Text>
        <Text style={styles.title}>How does today look?</Text>
      </View>
      <Input
        keyboardType="decimal-pad"
        onChangeText={onChangeText}
        placeholder="72.5"
        returnKeyType="done"
        value={value}
      />
      <Text style={styles.help}>Use kilograms. One or two decimals are okay.</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.md
  },
  help: {
    ...typography.caption,
    color: colors.textSecondary
  },
  label: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: "700",
    textTransform: "uppercase"
  },
  title: {
    ...typography.cardTitle,
    color: colors.text,
    marginTop: spacing.xs
  }
});
