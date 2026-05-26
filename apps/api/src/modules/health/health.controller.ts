import { Controller, Get } from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { HealthService, HealthStatusDto } from "./health.service";

@ApiTags("Health")
@Controller("health")
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOkResponse({ description: "API health status" })
  getHealth(): HealthStatusDto {
    return this.healthService.getStatus();
  }
}
