import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { HomeOverviewDto, WeightRecordDto } from "@weiqing/shared";
import { IsNull, Repository } from "typeorm";
import { getLocalDate } from "@weiqing/shared";
import { AiEncouragementEntity } from "../ai-encouragements/entities";
import { UserProfileEntity, UserSettingsEntity } from "../users/entities";
import { WeightRecordEntity } from "../weight-records/entities";
import { toWeightRecordDto } from "../weight-records/weight-record.mapper";

@Injectable()
export class HomeService {
  constructor(
    @InjectRepository(WeightRecordEntity)
    private readonly weightRecordsRepository: Repository<WeightRecordEntity>,
    @InjectRepository(AiEncouragementEntity)
    private readonly aiEncouragementsRepository: Repository<AiEncouragementEntity>,
    @InjectRepository(UserProfileEntity)
    private readonly profilesRepository: Repository<UserProfileEntity>,
    @InjectRepository(UserSettingsEntity)
    private readonly settingsRepository: Repository<UserSettingsEntity>
  ) {}

  async getOverview(userId: string): Promise<HomeOverviewDto> {
    const [settings, profile, latestRecords, latestEncouragement, totalRecords] =
      await Promise.all([
        this.settingsRepository.findOne({ where: { userId, deletedAt: IsNull() } }),
        this.profilesRepository.findOne({ where: { userId, deletedAt: IsNull() } }),
        this.weightRecordsRepository.find({
          where: { userId, deletedAt: IsNull() },
          order: { localDate: "DESC" },
          take: 7
        }),
        this.aiEncouragementsRepository.findOne({
          where: { userId, deletedAt: IsNull() },
          order: { createdAt: "DESC" }
        }),
        this.weightRecordsRepository.count({ where: { userId, deletedAt: IsNull() } })
      ]);

    const timezone = settings?.timezone ?? "Asia/Shanghai";
    const todayLocalDate = getLocalDate(new Date(), timezone);
    const todayRecord = latestRecords.find((record) => record.localDate === todayLocalDate) ?? null;
    const currentRecord = latestRecords[0] ?? null;
    const previousRecord = latestRecords[1] ?? null;

    return {
      todayRecord: todayRecord ? toWeightRecordDto(todayRecord) : null,
      latestEncouragement: latestEncouragement
        ? {
            id: latestEncouragement.id,
            weightRecordId: latestEncouragement.weightRecordId,
            title: latestEncouragement.title,
            message: latestEncouragement.message,
            tone: latestEncouragement.tone,
            tags: latestEncouragement.tags,
            model: latestEncouragement.model,
            generatedAt: latestEncouragement.generatedAt.toISOString(),
            createdAt: latestEncouragement.createdAt.toISOString(),
            updatedAt: latestEncouragement.updatedAt.toISOString()
          }
        : null,
      summary: {
        currentWeightKg: currentRecord?.weightKg ?? null,
        targetWeightKg: profile?.targetWeightKg ?? null,
        diffFromLastKg:
          currentRecord && previousRecord
            ? this.round(currentRecord.weightKg - previousRecord.weightKg)
            : null,
        streakDays: this.calculateStreakDays(latestRecords.map((record) => record.localDate)),
        totalRecords
      },
      trendPreview: [...latestRecords]
        .reverse()
        .map((record): Pick<WeightRecordDto, "localDate" | "weightKg"> => ({
          localDate: record.localDate,
          weightKg: record.weightKg
        }))
    };
  }

  private calculateStreakDays(localDates: string[]): number {
    if (localDates.length === 0) {
      return 0;
    }

    const uniqueDates = [...new Set(localDates)].sort().reverse();
    let streak = 1;
    const cursor = new Date(`${uniqueDates[0]}T00:00:00.000Z`);

    for (const localDate of uniqueDates.slice(1)) {
      cursor.setUTCDate(cursor.getUTCDate() - 1);
      const expected = cursor.toISOString().slice(0, 10);

      if (localDate !== expected) {
        break;
      }

      streak += 1;
    }

    return streak;
  }

  private round(value: number): number {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  }
}
