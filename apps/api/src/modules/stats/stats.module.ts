import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserProfileEntity } from "../users/entities";
import { WeightRecordEntity } from "../weight-records/entities";
import { StatsController } from "./stats.controller";
import { StatsService } from "./stats.service";

@Module({
  imports: [TypeOrmModule.forFeature([WeightRecordEntity, UserProfileEntity])],
  controllers: [StatsController],
  providers: [StatsService],
  exports: [StatsService]
})
export class StatsModule {}
