import { InternalServerErrorException, Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { IsNull, LessThan, Repository } from "typeorm";
import { AiEncouragementEntity } from "../ai-encouragements/entities";
import { UserProfileEntity, UserSettingsEntity } from "../users/entities";
import { WeightRecordEntity } from "../weight-records/entities";
import {
  SafeAiEncouragementDto,
  toSafeAiEncouragementDto
} from "./ai-encouragement.mapper";
import { AiFallbackService, AiEncouragementInput } from "./ai-fallback.service";
import { aiEncouragementOutputSchema, AiEncouragementOutput } from "./ai-output.schema";

export type AiGenerationStatus = "ready" | "generating" | "failed" | "skipped";

export interface GenerateEncouragementResponse {
  encouragement: SafeAiEncouragementDto | null;
  status: AiGenerationStatus;
}

@Injectable()
export class AiService {
  constructor(
    @InjectRepository(AiEncouragementEntity)
    private readonly aiEncouragementsRepository: Repository<AiEncouragementEntity>,
    @InjectRepository(WeightRecordEntity)
    private readonly weightRecordsRepository: Repository<WeightRecordEntity>,
    @InjectRepository(UserProfileEntity)
    private readonly profilesRepository: Repository<UserProfileEntity>,
    @InjectRepository(UserSettingsEntity)
    private readonly settingsRepository: Repository<UserSettingsEntity>,
    private readonly fallbackService: AiFallbackService,
    private readonly configService: ConfigService
  ) {}

  async generate(
    userId: string,
    weightRecordId: string
  ): Promise<GenerateEncouragementResponse> {
    const weightRecord = await this.findOwnedWeightRecord(userId, weightRecordId);
    const cached = await this.findCachedEncouragement(userId, weightRecordId);

    if (cached) {
      return {
        encouragement: toSafeAiEncouragementDto(cached),
        status: "ready"
      };
    }

    const input = await this.buildInputSnapshot(userId, weightRecord);
    const inputSnapshot = this.toInputSnapshot(input);
    const output = this.validateOutput(this.fallbackService.generate(input));
    const entity = this.aiEncouragementsRepository.create({
      userId,
      weightRecordId,
      title: output.title,
      message: output.message,
      tone: output.tone,
      tags: output.tags,
      model: "local-fallback",
      promptVersion: this.configService.get<string>("ai.promptVersion") ?? "v1",
      inputSnapshot,
      rawOutput: output as unknown as Record<string, unknown>,
      generatedAt: new Date()
    });

    const saved = await this.aiEncouragementsRepository.save(entity);

    return {
      encouragement: toSafeAiEncouragementDto(saved),
      status: "ready"
    };
  }

  async getLatest(userId: string): Promise<SafeAiEncouragementDto | null> {
    const encouragement = await this.aiEncouragementsRepository.findOne({
      where: {
        userId,
        deletedAt: IsNull()
      },
      order: {
        generatedAt: "DESC"
      }
    });

    return encouragement ? toSafeAiEncouragementDto(encouragement) : null;
  }

  private async findOwnedWeightRecord(
    userId: string,
    weightRecordId: string
  ): Promise<WeightRecordEntity> {
    const weightRecord = await this.weightRecordsRepository.findOne({
      where: {
        id: weightRecordId,
        userId,
        deletedAt: IsNull()
      }
    });

    if (!weightRecord) {
      throw new NotFoundException({
        code: "WEIGHT_RECORD_NOT_FOUND",
        message: "Weight record not found"
      });
    }

    return weightRecord;
  }

  private findCachedEncouragement(
    userId: string,
    weightRecordId: string
  ): Promise<AiEncouragementEntity | null> {
    return this.aiEncouragementsRepository.findOne({
      where: {
        userId,
        weightRecordId,
        deletedAt: IsNull()
      }
    });
  }

  private async buildInputSnapshot(
    userId: string,
    weightRecord: WeightRecordEntity
  ): Promise<AiEncouragementInput> {
    const [previousRecord, profile, settings, recentRecords, totalRecords] = await Promise.all([
      this.weightRecordsRepository.findOne({
        where: {
          userId,
          deletedAt: IsNull(),
          localDate: LessThan(weightRecord.localDate)
        },
        order: {
          localDate: "DESC"
        }
      }),
      this.profilesRepository.findOne({
        where: {
          userId,
          deletedAt: IsNull()
        }
      }),
      this.settingsRepository.findOne({
        where: {
          userId,
          deletedAt: IsNull()
        }
      }),
      this.weightRecordsRepository.find({
        where: {
          userId,
          deletedAt: IsNull()
        },
        order: {
          localDate: "DESC"
        },
        take: 120
      }),
      this.weightRecordsRepository.count({
        where: {
          userId,
          deletedAt: IsNull()
        }
      })
    ]);

    return {
      currentWeightKg: weightRecord.weightKg,
      previousWeightKg: previousRecord?.weightKg ?? null,
      targetWeightKg: profile?.targetWeightKg ?? null,
      initialWeightKg: profile?.initialWeightKg ?? null,
      streakDays: this.calculateStreakDays(recentRecords.map((record) => record.localDate)),
      totalRecords,
      localDate: weightRecord.localDate,
      timezone: weightRecord.timezone,
      mood: weightRecord.mood ?? null,
      note: this.truncateNote(weightRecord.note),
      aiTonePreference: settings?.aiTonePreference ?? null
    };
  }

  private validateOutput(output: AiEncouragementOutput): AiEncouragementOutput {
    const parsed = aiEncouragementOutputSchema.safeParse(output);

    if (parsed.success) {
      return parsed.data;
    }

    const fallback = aiEncouragementOutputSchema.safeParse(
      this.fallbackService.getComfortFallback()
    );

    if (fallback.success) {
      return fallback.data;
    }

    throw new InternalServerErrorException({
      code: "AI_GENERATION_FAILED",
      message: "Unable to generate encouragement"
    });
  }

  private toInputSnapshot(input: AiEncouragementInput): Record<string, unknown> {
    return {
      currentWeightKg: input.currentWeightKg,
      previousWeightKg: input.previousWeightKg ?? null,
      targetWeightKg: input.targetWeightKg ?? null,
      initialWeightKg: input.initialWeightKg ?? null,
      streakDays: input.streakDays,
      totalRecords: input.totalRecords,
      localDate: input.localDate,
      timezone: input.timezone,
      mood: input.mood ?? null,
      note: input.note ?? null,
      aiTonePreference: input.aiTonePreference ?? null
    };
  }

  private truncateNote(note: string | null): string | null {
    if (!note) {
      return null;
    }

    const maxNoteChars = this.configService.get<number>("ai.maxNoteChars") ?? 200;
    return note.slice(0, Math.max(0, maxNoteChars));
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
}
