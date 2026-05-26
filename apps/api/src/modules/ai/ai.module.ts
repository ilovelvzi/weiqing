import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AiEncouragementEntity } from "../ai-encouragements/entities";
import { UserProfileEntity, UserSettingsEntity } from "../users/entities";
import { WeightRecordEntity } from "../weight-records/entities";
import { AiController } from "./ai.controller";
import { AiFallbackService } from "./ai-fallback.service";
import { AiPromptService } from "./ai-prompt.service";
import { AiService } from "./ai.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AiEncouragementEntity,
      WeightRecordEntity,
      UserProfileEntity,
      UserSettingsEntity
    ])
  ],
  controllers: [AiController],
  providers: [AiService, AiFallbackService, AiPromptService],
  exports: [AiService]
})
export class AiModule {}
