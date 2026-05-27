import type { Mood } from "@weiqing/shared";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Button, Card } from "../../../components/base";
import { colors, radius, spacing, typography } from "../../../styles";
import { formatWeightKg, getMonthDays } from "../../../utils";

interface CalendarRecord {
  localDate: string;
  weightKg: number;
  mood: Mood | null;
  hasNote: boolean;
}

interface MonthCalendarProps {
  month: number;
  onNextMonth: () => void;
  onPreviousMonth: () => void;
  records: CalendarRecord[];
  year: number;
}

export function MonthCalendar({
  month,
  onNextMonth,
  onPreviousMonth,
  records,
  year
}: MonthCalendarProps) {
  const recordMap = new Map(records.map((record) => [record.localDate, record]));

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <Button onPress={onPreviousMonth} variant="ghost">Prev</Button>
        <Text style={styles.title}>
          {year}-{String(month).padStart(2, "0")}
        </Text>
        <Button onPress={onNextMonth} variant="ghost">Next</Button>
      </View>

      <View style={styles.grid}>
        {getMonthDays(year, month).map((day) => {
          const record = recordMap.get(day);

          return (
            <Pressable
              accessibilityRole="button"
              disabled={!record}
              key={day}
              style={[styles.day, record && styles.recordedDay]}
            >
              <Text style={[styles.dayText, record && styles.recordedText]}>{Number(day.slice(-2))}</Text>
              {record ? <Text style={styles.weight}>{formatWeightKg(record.weightKg).replace(" kg", "")}</Text> : null}
            </Pressable>
          );
        })}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.md
  },
  day: {
    alignItems: "center",
    backgroundColor: colors.surfaceLow,
    borderRadius: radius.md,
    gap: spacing.xs,
    minHeight: 58,
    justifyContent: "center",
    width: "13%"
  },
  dayText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: "700"
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  recordedDay: {
    backgroundColor: colors.primaryLight
  },
  recordedText: {
    color: colors.primary
  },
  title: {
    ...typography.cardTitle,
    color: colors.text
  },
  weight: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: "700"
  }
});
