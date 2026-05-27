import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "../../common/decorators";
import { JwtAuthGuard } from "../../common/guards";
import { JwtUser } from "../../common/types";
import { SummaryQueryDto, TrendQueryDto } from "./dto";
import { StatsService } from "./stats.service";

@ApiTags("Stats")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("stats")
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get("summary")
  getSummary(@CurrentUser() user: JwtUser, @Query() query: SummaryQueryDto) {
    void query;
    return this.statsService.getSummary(user.id);
  }

  @Get("trend")
  getTrend(@CurrentUser() user: JwtUser, @Query() query: TrendQueryDto) {
    return this.statsService.getTrend(user.id, query.range);
  }
}
