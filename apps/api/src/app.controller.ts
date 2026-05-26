import { Controller, Get } from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { AppInfoDto, AppService } from "./app.service";

@ApiTags("App")
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOkResponse({ description: "API service metadata" })
  getInfo(): AppInfoDto {
    return this.appService.getInfo();
  }
}
