import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "../../common/decorators";
import { JwtAuthGuard } from "../../common/guards";
import { JwtUser } from "../../common/types";
import {
  CalendarWeightRecordsDto,
  CreateWeightRecordDto,
  QueryWeightRecordsDto,
  UpdateWeightRecordDto
} from "./dto";
import { WeightRecordsService } from "./weight-records.service";

@ApiTags("Weight Records")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("weight-records")
export class WeightRecordsController {
  constructor(private readonly weightRecordsService: WeightRecordsService) {}

  @Post()
  create(@CurrentUser() user: JwtUser, @Body() dto: CreateWeightRecordDto) {
    return this.weightRecordsService.createOrUpdate(user.id, dto);
  }

  @Get()
  list(@CurrentUser() user: JwtUser, @Query() query: QueryWeightRecordsDto) {
    return this.weightRecordsService.list(user.id, query);
  }

  @Get("calendar")
  calendar(@CurrentUser() user: JwtUser, @Query() query: CalendarWeightRecordsDto) {
    return this.weightRecordsService.calendar(user.id, query);
  }

  @Get(":id")
  detail(@CurrentUser() user: JwtUser, @Param("id") id: string) {
    return this.weightRecordsService.detail(user.id, id);
  }

  @Patch(":id")
  update(
    @CurrentUser() user: JwtUser,
    @Param("id") id: string,
    @Body() dto: UpdateWeightRecordDto
  ) {
    return this.weightRecordsService.update(user.id, id, dto);
  }

  @Delete(":id")
  delete(@CurrentUser() user: JwtUser, @Param("id") id: string) {
    return this.weightRecordsService.delete(user.id, id);
  }
}
