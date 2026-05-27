import "reflect-metadata";
import * as dotenv from "dotenv";
import * as path from "path";
import { DataSource, DataSourceOptions } from "typeorm";

// Load .env for TypeORM CLI usage; dotenv skips vars already set at runtime
dotenv.config({ path: path.resolve(__dirname, "../../../../.env") }); // monorepo root
dotenv.config({ path: path.resolve(__dirname, "../../.env") });        // apps/api/.env

const databaseUrl = process.env.DATABASE_DIRECT_URL ?? process.env.DATABASE_URL;
const sslEnabled = (process.env.DATABASE_SSL ?? "true") === "true";

export const dataSourceOptions: DataSourceOptions = {
  type: "postgres",
  url: databaseUrl,
  ssl: sslEnabled ? { rejectUnauthorized: false } : false,
  synchronize: false,
  logging: (process.env.TYPEORM_LOGGING ?? "false") === "true",
  entities: [__dirname + "/../modules/**/*.entity{.ts,.js}"],
  migrations: [__dirname + "/migrations/*{.ts,.js}"]
};

const AppDataSource = new DataSource(dataSourceOptions);
export default AppDataSource;
