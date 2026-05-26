import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "../../common/decorators";
import { JwtAuthGuard } from "../../common/guards";
import { JwtUser } from "../../common/types";
import { HomeService } from "./home.service";

@ApiTags("Home")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("home")
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Get("overview")
  getOverview(@CurrentUser() user: JwtUser) {
    return this.homeService.getOverview(user.id);
  }
}
