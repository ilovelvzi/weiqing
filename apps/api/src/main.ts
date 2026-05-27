import "reflect-metadata";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { AppModule } from "./app.module";
import { HttpExceptionFilter, ResponseInterceptor } from "./common";

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const apiPrefix = configService.get<string>("app.apiPrefix", "api/v1");
  app.setGlobalPrefix(apiPrefix);

  app.use(helmet());
  app.use(cookieParser());
  app.enableCors({
    origin: configService.get<string | string[]>("cors.origin", [
      "http://localhost:10086",
      "http://localhost:8081"
    ]),
    credentials: configService.get<boolean>("cors.credentials", true)
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    })
  );
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  const swaggerConfig = new DocumentBuilder()
    .setTitle("微轻 API")
    .setDescription("WeiQing REST API")
    .setVersion("0.1.0")
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("api/docs", app, document);

  const port = configService.get<number>("app.port", 3000);
  await app.listen(port);
}

void bootstrap();
