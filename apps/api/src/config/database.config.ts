import { registerAs } from "@nestjs/config";

export interface DatabaseConfig {
  url?: string;
  directUrl?: string;
  ssl: boolean;
  synchronize: false;
}

export default registerAs(
  "database",
  (): DatabaseConfig => ({
    url: process.env.DATABASE_URL,
    directUrl: process.env.DATABASE_DIRECT_URL,
    ssl: (process.env.DATABASE_SSL ?? "true") === "true",
    synchronize: false
  })
);
