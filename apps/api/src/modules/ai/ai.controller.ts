import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "../../common/decorators";
import { JwtAuthGuard } from "../../common/guards";
import { JwtUser } from "../../common/types";
import { AiService } from "./ai.service";
import { GenerateEncouragementDto } from "./dto";

@ApiTags("AI")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("ai/encouragements")
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post("generate")
  generate(@CurrentUser() user: JwtUser, @Body() dto: GenerateEncouragementDto) {
    return this.aiService.generate(user.id, dto.weightRecordId);
  }

  @Get("latest")
  latest(@CurrentUser() user: JwtUser) {
    return this.aiService.getLatest(user.id);
  }
}
