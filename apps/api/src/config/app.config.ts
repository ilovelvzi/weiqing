import { registerAs } from "@nestjs/config";

export interface AppConfig {
  env: string;
  name: string;
  port: number;
  apiPrefix: string;
}

export default registerAs(
  "app",
  (): AppConfig => ({
    env: process.env.APP_ENV ?? process.env.NODE_ENV ?? "development",
    name: process.env.APP_NAME ?? "微轻",
    port: Number(process.env.API_PORT ?? 3000),
    apiPrefix: process.env.API_PREFIX ?? "api/v1"
  })
);
