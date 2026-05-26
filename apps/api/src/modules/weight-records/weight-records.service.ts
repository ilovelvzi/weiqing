import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PaginatedResponse, RecordSource, WeightRecordDto } from "@weiqing/shared";
import { Between, IsNull, LessThanOrEqual, MoreThanOrEqual, Not, Repository } from "typeorm";
import {
  CalendarWeightRecordsDto,
  CreateWeightRecordDto,
  QueryWeightRecordsDto,
  UpdateWeightRecordDto
} from "./dto";
import { WeightRecordEntity } from "./entities";
import {
  WeightRecordCalendarItemDto,
  WeightRecordDetailDto,
  WeightRecordMutationDto,
  WeightRecordUpdateDto,
  toWeightRecordDto
} from "./weight-record.mapper";

@Injectable()
export class WeightRecordsService {
  constructor(
    @InjectRepository(WeightRecordEntity)
    private readonly weightRecordsRepository: Repository<WeightRecordEntity>
  ) {}

  async createOrUpdate(userId: string, dto: CreateWeightRecordDto): Promise<WeightRecordMutationDto> {
    const existing = await this.weightRecordsRepository.findOne({
      where: {
        userId,
        localDate: dto.localDate,
        deletedAt: IsNull()
      }
    });

    const record =
      existing ??
      this.weightRecordsRepository.create({
        userId,
        localDate: dto.localDate,
        recordedAt: new Date()
      });

    this.weightRecordsRepository.merge(record, {
      weightKg: dto.weightKg,
      timezone: dto.timezone,
      mood: dto.mood ?? null,
      note: dto.note ?? null,
      source: dto.source ?? existing?.source ?? RecordSource.MANUAL
    });

    const saved = await this.weightRecordsRepository.save(record);

    return {
      record: toWeightRecordDto(saved),
      encouragement: null,
      encouragementStatus: "skipped"
    };
  }

  async list(
    userId: string,
    query: QueryWeightRecordsDto
  ): Promise<PaginatedResponse<WeightRecordDto>> {
    const page = query.page ?? 1;
    const pageSize = Math.min(query.pageSize ?? 20, 50);
    const [items, total] = await this.weightRecordsRepository.findAndCount({
      where: {
        userId,
        deletedAt: IsNull(),
        ...(query.startDate || query.endDate
          ? {
              localDate: this.buildDateFilter(query.startDate, query.endDate)
            }
          : {})
      },
      order: {
        localDate: "DESC"
      },
      skip: (page - 1) * pageSize,
      take: pageSize
    });

    return {
      items: items.map(toWeightRecordDto),
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize)
    };
  }

  async calendar(userId: string, query: CalendarWeightRecordsDto) {
    const month = String(query.month).padStart(2, "0");
    const startDate = `${query.year}-${month}-01`;
    const endDate = this.getMonthEndDate(query.year, query.month);

    const records = await this.weightRecordsRepository.find({
      where: {
        userId,
        deletedAt: IsNull(),
        localDate: Between(startDate, endDate)
      },
      order: {
        localDate: "ASC"
      }
    });

    return {
      year: query.year,
      month: query.month,
      records: records.map(
        (record): WeightRecordCalendarItemDto => ({
          localDate: record.localDate,
          weightKg: record.weightKg,
          mood: record.mood,
          hasNote: Boolean(record.note)
        })
      )
    };
  }

  async detail(userId: string, id: string): Promise<WeightRecordDetailDto> {
    const record = await this.findOwnedRecord(userId, id);

    return {
      record: toWeightRecordDto(record),
      encouragement: null
    };
  }

  async update(userId: string, id: string, dto: UpdateWeightRecordDto): Promise<WeightRecordUpdateDto> {
    const record = await this.findOwnedRecord(userId, id);

    if (dto.localDate && dto.localDate !== record.localDate) {
      const conflict = await this.weightRecordsRepository.findOne({
        where: {
          userId,
          localDate: dto.localDate,
          id: Not(id),
          deletedAt: IsNull()
        }
      });

      if (conflict) {
        throw new BadRequestException({
          code: "WEIGHT_RECORD_DATE_CONFLICT",
          message: "A weight record already exists for this local date"
        });
      }
    }

    this.weightRecordsRepository.merge(record, {
      weightKg: dto.weightKg ?? record.weightKg,
      localDate: dto.localDate ?? record.localDate,
      timezone: dto.timezone ?? record.timezone,
      mood: dto.mood === undefined ? record.mood : dto.mood,
      note: dto.note === undefined ? record.note : dto.note
    });

    const saved = await this.weightRecordsRepository.save(record);

    return {
      record: toWeightRecordDto(saved),
      encouragementRegenerated: false
    };
  }

  async delete(userId: string, id: string): Promise<{ deleted: true }> {
    const record = await this.findOwnedRecord(userId, id);
    await this.weightRecordsRepository.softRemove(record);

    return { deleted: true };
  }

  private async findOwnedRecord(userId: string, id: string): Promise<WeightRecordEntity> {
    const record = await this.weightRecordsRepository.findOne({
      where: {
        id,
        userId,
        deletedAt: IsNull()
      }
    });

    if (!record) {
      throw new NotFoundException({
        code: "WEIGHT_RECORD_NOT_FOUND",
        message: "Weight record not found"
      });
    }

    return record;
  }

  private buildDateFilter(startDate?: string, endDate?: string) {
    if (startDate && endDate) {
      return Between(startDate, endDate);
    }

    if (startDate) {
      return MoreThanOrEqual(startDate);
    }

    return LessThanOrEqual(endDate as string);
  }

  private getMonthEndDate(year: number, month: number): string {
    const end = new Date(Date.UTC(year, month, 0));
    const endMonth = String(end.getUTCMonth() + 1).padStart(2, "0");
    const endDay = String(end.getUTCDate()).padStart(2, "0");
    return `${end.getUTCFullYear()}-${endMonth}-${endDay}`;
  }
}
