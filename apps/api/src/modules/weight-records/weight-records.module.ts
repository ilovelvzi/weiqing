import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { WeightRecordEntity } from "./entities";
import { WeightRecordsController } from "./weight-records.controller";
import { WeightRecordsService } from "./weight-records.service";

@Module({
  imports: [TypeOrmModule.forFeature([WeightRecordEntity])],
  controllers: [WeightRecordsController],
  providers: [WeightRecordsService],
  exports: [WeightRecordsService]
})
export class WeightRecordsModule {}
