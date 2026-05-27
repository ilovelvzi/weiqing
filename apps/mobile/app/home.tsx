import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Button } from "../src/components/base";
import { EmptyState, ErrorView, Loading } from "../src/components/feedback";
import { PageShell } from "../src/components/layout";
import { EncouragementCard } from "../src/features/ai/components";
import { useHomeOverviewQuery } from "../src/features/home/home.hooks";
import {
  GoalProgressCard,
  TodayWeightCard,
  TrendPreviewCard
} from "../src/features/home/components";
import { routes } from "../src/services";
import { colors, spacing, typography } from "../src/styles";

export default function HomeRoute() {
  const router = useRouter();
  const homeQuery = useHomeOverviewQuery();
  const overview = homeQuery.data;

  if (homeQuery.isPending) {
    return (
      <PageShell title="Today" description="A quiet place to keep your rhythm.">
        <Loading label="Loading overview" />
      </PageShell>
    );
  }

  if (homeQuery.isError) {
    return (
      <PageShell title="Today" description="A quiet place to keep your rhythm.">
        <ErrorView message="Could not load your home overview." />
        <Button onPress={() => void homeQuery.refetch()} variant="secondary">
          Try again
        </Button>
      </PageShell>
    );
  }

  if (!overview || overview.summary.totalRecords === 0) {
    return (
      <PageShell title="Today" description="A quiet place to keep your rhythm.">
        <EmptyState
          title="Start with today"
          description="A first check-in is enough. No trend, no pressure, just a clear note."
        />
        <Button onPress={() => router.push(routes.checkIn)}>Check in today</Button>
      </PageShell>
    );
  }

  return (
    <PageShell title="Today" description="A quiet place to keep your rhythm.">
      <View style={styles.greeting}>
        <Text style={styles.greetingTitle}>Welcome back</Text>
        <Text style={styles.greetingText}>One calm check-in at a time.</Text>
      </View>

      <TodayWeightCard
        currentWeightKg={overview.summary.currentWeightKg}
        todayRecord={overview.todayRecord}
      />

      <EncouragementCard encouragement={overview.latestEncouragement} />

      <TrendPreviewCard points={overview.trendPreview} />

      <GoalProgressCard
        currentWeightKg={overview.summary.currentWeightKg}
        targetWeightKg={overview.summary.targetWeightKg}
      />

      <Button onPress={() => router.push(routes.checkIn)}>Check in today</Button>

      <View style={styles.navRow}>
        <NavLink label="Trend" onPress={() => router.push(routes.trend)} />
        <NavLink label="Records" onPress={() => router.push(routes.records)} />
        <NavLink label="Profile" onPress={() => router.push(routes.profile)} />
      </View>
    </PageShell>
  );
}

function NavLink({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={styles.navButton}>
      <Text style={styles.navText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  greeting: {
    backgroundColor: colors.surfaceLow,
    borderRadius: 24,
    gap: spacing.xs,
    padding: spacing.lg
  },
  greetingText: {
    ...typography.subheadline,
    color: colors.textSecondary
  },
  greetingTitle: {
    ...typography.cardTitle,
    color: colors.text
  },
  navButton: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderColor: colors.separator,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    flex: 1,
    minHeight: 44,
    justifyContent: "center",
    paddingHorizontal: spacing.sm
  },
  navRow: {
    flexDirection: "row",
    gap: spacing.sm
  },
  navText: {
    ...typography.subheadline,
    color: colors.primary,
    fontWeight: "700"
  }
});
