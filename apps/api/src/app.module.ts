import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { aiConfig, appConfig, corsConfig, databaseConfig, jwtConfig } from "./config";
import { AuthModule } from "./modules/auth";
import { HealthModule } from "./modules/health";
import { UsersModule } from "./modules/users";
import { WeightRecordsModule } from "./modules/weight-records";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, jwtConfig, aiConfig, corsConfig]
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => ({
        type: "postgres",
        url:
          configService.get<string>("database.directUrl") ??
          configService.get<string>("database.url"),
        ssl: configService.get<boolean>("database.ssl")
          ? { rejectUnauthorized: false }
          : false,
        synchronize: false,
        autoLoadEntities: true
      })
    }),
    HealthModule,
    UsersModule,
    AuthModule,
    WeightRecordsModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
