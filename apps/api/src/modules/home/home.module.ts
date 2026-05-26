import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AiEncouragementEntity } from "../ai-encouragements/entities";
import { UserProfileEntity, UserSettingsEntity } from "../users/entities";
import { WeightRecordEntity } from "../weight-records/entities";
import { HomeController } from "./home.controller";
import { HomeService } from "./home.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      WeightRecordEntity,
      AiEncouragementEntity,
      UserProfileEntity,
      UserSettingsEntity
    ])
  ],
  controllers: [HomeController],
  providers: [HomeService]
})
export class HomeModule {}
