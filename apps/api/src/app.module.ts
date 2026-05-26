import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { aiConfig, appConfig, corsConfig, databaseConfig, jwtConfig } from "./config";
import { HealthModule } from "./modules/health";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, jwtConfig, aiConfig, corsConfig]
    }),
    HealthModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
