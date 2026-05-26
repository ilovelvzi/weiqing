import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RefreshTokenEntity } from "../auth/entities";
import { UserEntity } from "../users/entities";
import { AccountController } from "./account.controller";
import { AccountService } from "./account.service";
import { AccountDeletionRequestEntity } from "./entities";

@Module({
  imports: [TypeOrmModule.forFeature([AccountDeletionRequestEntity, UserEntity, RefreshTokenEntity])],
  controllers: [AccountController],
  providers: [AccountService]
})
export class AccountModule {}
