import type { WeightTrendPointDto } from "@weiqing/shared";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Line, Polyline } from "react-native-svg";
import { Card } from "../../../components/base";
import { colors, spacing, typography } from "../../../styles";
import { formatWeightKg } from "../../../utils";

interface WeightTrendChartProps {
  points: WeightTrendPointDto[];
}

const chartWidth = 300;
const chartHeight = 160;
const chartPadding = 18;

export function WeightTrendChart({ points }: WeightTrendChartProps) {
  if (points.length < 2) {
    return (
      <Card style={styles.card}>
        <Text style={styles.title}>Trend</Text>
        <Text style={styles.empty}>A curve will appear after a few days of records.</Text>
      </Card>
    );
  }

  const plotted = buildPlot(points);
  const first = points[0];
  const latest = points[points.length - 1];

  return (
    <Card style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.label}>Trend</Text>
          <Text style={styles.title}>{formatWeightKg(latest?.weightKg)}</Text>
        </View>
        <Text style={styles.caption}>{points.length} points</Text>
      </View>

      <View style={styles.chartWrap}>
        <Svg height={chartHeight} viewBox={`0 0 ${chartWidth} ${chartHeight}`} width="100%">
          <Line
            stroke={colors.separator}
            strokeWidth={1}
            x1={chartPadding}
            x2={chartWidth - chartPadding}
            y1={chartHeight - chartPadding}
            y2={chartHeight - chartPadding}
          />
          <Polyline
            fill="none"
            points={plotted.map((point) => `${point.x},${point.y}`).join(" ")}
            stroke={colors.primary}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={4}
          />
          {plotted.map((point) => (
            <Circle
              cx={point.x}
              cy={point.y}
              fill={colors.surface}
              key={point.localDate}
              r={4}
              stroke={colors.primary}
              strokeWidth={2}
            />
          ))}
        </Svg>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>{first?.localDate}</Text>
        <Text style={styles.footerText}>{latest?.localDate}</Text>
      </View>
    </Card>
  );
}

function buildPlot(points: WeightTrendPointDto[]) {
  const weights = points.map((point) => point.weightKg);
  const min = Math.min(...weights);
  const max = Math.max(...weights);
  const spread = max - min || 1;
  const innerWidth = chartWidth - chartPadding * 2;
  const innerHeight = chartHeight - chartPadding * 2;

  return points.map((point, index) => ({
    localDate: point.localDate,
    x: chartPadding + (innerWidth * index) / (points.length - 1),
    y: chartPadding + innerHeight - ((point.weightKg - min) / spread) * innerHeight
  }));
}

const styles = StyleSheet.create({
  caption: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: "600"
  },
  card: {
    gap: spacing.md
  },
  chartWrap: {
    backgroundColor: colors.surfaceLow,
    borderRadius: 20,
    overflow: "hidden",
    paddingVertical: spacing.sm
  },
  empty: {
    ...typography.subheadline,
    color: colors.textSecondary,
    textAlign: "center"
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  footerText: {
    ...typography.caption,
    color: colors.textSecondary
  },
  header: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between"
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
