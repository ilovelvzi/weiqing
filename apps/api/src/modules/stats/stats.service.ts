import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { TrendRange } from "@weiqing/shared";
import { Between, IsNull, Repository } from "typeorm";
import { UserProfileEntity } from "../users/entities";
import { WeightRecordEntity } from "../weight-records/entities";

interface TrendPoint {
  localDate: string;
  weightKg: number;
}

export interface StatsSummaryResponseDto {
  currentWeightKg: number | null;
  initialWeightKg: number | null;
  targetWeightKg: number | null;
  totalChangeKg: number | null;
  diffToTargetKg: number | null;
  streakDays: number;
  totalRecords: number;
  lastRecordedDate: string | null;
}

export interface TrendResponseDto {
  range: TrendRange;
  points: TrendPoint[];
  summary: {
    startWeightKg: number | null;
    endWeightKg: number | null;
    minWeightKg: number | null;
    maxWeightKg: number | null;
    averageWeightKg: number | null;
    changeKg: number | null;
  };
  targetWeightKg: number | null;
}

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(WeightRecordEntity)
    private readonly weightRecordsRepository: Repository<WeightRecordEntity>,
    @InjectRepository(UserProfileEntity)
    private readonly profilesRepository: Repository<UserProfileEntity>
  ) {}

  async getSummary(userId: string): Promise<StatsSummaryResponseDto> {
    const [latestRecord, earliestRecord, totalRecords, profile, recordsForStreak] =
      await Promise.all([
        this.weightRecordsRepository.findOne({
          where: { userId, deletedAt: IsNull() },
          order: { localDate: "DESC" }
        }),
        this.weightRecordsRepository.findOne({
          where: { userId, deletedAt: IsNull() },
          order: { localDate: "ASC" }
        }),
        this.weightRecordsRepository.count({
          where: { userId, deletedAt: IsNull() }
        }),
        this.profilesRepository.findOne({
          where: { userId, deletedAt: IsNull() }
        }),
        this.weightRecordsRepository.find({
          where: { userId, deletedAt: IsNull() },
          select: { localDate: true },
          order: { localDate: "DESC" },
          take: 120
        })
      ]);

    const currentWeightKg = latestRecord?.weightKg ?? null;
    const initialWeightKg = profile?.initialWeightKg ?? earliestRecord?.weightKg ?? null;
    const targetWeightKg = profile?.targetWeightKg ?? null;

    return {
      currentWeightKg,
      initialWeightKg,
      targetWeightKg,
      totalChangeKg:
        currentWeightKg !== null && initialWeightKg !== null
          ? this.round(currentWeightKg - initialWeightKg)
          : null,
      diffToTargetKg:
        currentWeightKg !== null && targetWeightKg !== null
          ? this.round(currentWeightKg - targetWeightKg)
          : null,
      streakDays: this.calculateStreakDays(recordsForStreak.map((record) => record.localDate)),
      totalRecords,
      lastRecordedDate: latestRecord?.localDate ?? null
    };
  }

  async getTrend(userId: string, range: TrendRange): Promise<TrendResponseDto> {
    const days = this.rangeToDays(range);
    const endDate = new Date();
    const startDate = new Date();
    startDate.setUTCDate(endDate.getUTCDate() - days + 1);

    const startLocalDate = this.formatUtcDate(startDate);
    const endLocalDate = this.formatUtcDate(endDate);

    const [records, profile] = await Promise.all([
      this.weightRecordsRepository.find({
        where: {
          userId,
          deletedAt: IsNull(),
          localDate: Between(startLocalDate, endLocalDate)
        },
        order: { localDate: "ASC" }
      }),
      this.profilesRepository.findOne({ where: { userId, deletedAt: IsNull() } })
    ]);

    const points = records.map((record) => ({
      localDate: record.localDate,
      weightKg: record.weightKg
    }));

    return {
      range,
      points,
      summary: this.buildTrendSummary(points),
      targetWeightKg: profile?.targetWeightKg ?? null
    };
  }

  private buildTrendSummary(points: TrendPoint[]): TrendResponseDto["summary"] {
    if (points.length === 0) {
      return {
        startWeightKg: null,
        endWeightKg: null,
        minWeightKg: null,
        maxWeightKg: null,
        averageWeightKg: null,
        changeKg: null
      };
    }

    const weights = points.map((point) => point.weightKg);
    const startWeightKg = weights[0];
    const endWeightKg = weights[weights.length - 1];
    const average = weights.reduce((sum, weight) => sum + weight, 0) / weights.length;

    return {
      startWeightKg,
      endWeightKg,
      minWeightKg: Math.min(...weights),
      maxWeightKg: Math.max(...weights),
      averageWeightKg: this.round(average),
      changeKg: this.round(endWeightKg - startWeightKg)
    };
  }

  private calculateStreakDays(localDates: string[]): number {
    if (localDates.length === 0) {
      return 0;
    }

    const uniqueDates = [...new Set(localDates)].sort().reverse();
    let streak = 1;
    let cursor = this.parseLocalDate(uniqueDates[0]);

    for (const localDate of uniqueDates.slice(1)) {
      cursor.setUTCDate(cursor.getUTCDate() - 1);
      const expected = this.formatUtcDate(cursor);

      if (localDate !== expected) {
        break;
      }

      streak += 1;
    }

    return streak;
  }

  private rangeToDays(range: TrendRange): number {
    if (range === TrendRange.SEVEN_DAYS) return 7;
    if (range === TrendRange.NINETY_DAYS) return 90;
    return 30;
  }

  private parseLocalDate(localDate: string): Date {
    return new Date(`${localDate}T00:00:00.000Z`);
  }

  private formatUtcDate(date: Date): string {
    return date.toISOString().slice(0, 10);
  }

  private round(value: number): number {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  }
}
