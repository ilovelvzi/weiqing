import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "../../common/decorators";
import { JwtAuthGuard } from "../../common/guards";
import { JwtUser } from "../../common/types";
import { AccountService } from "./account.service";
import { RequestDeleteAccountDto } from "./dto";

@ApiTags("Account")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("account")
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post("delete-request")
  requestDeletion(@CurrentUser() user: JwtUser, @Body() dto: RequestDeleteAccountDto) {
    return this.accountService.requestDeletion(user.id, dto);
  }

  @Post("delete-request/cancel")
  cancelDeletion(@CurrentUser() user: JwtUser) {
    return this.accountService.cancelDeletion(user.id);
  }
}
