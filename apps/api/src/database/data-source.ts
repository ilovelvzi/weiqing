import "reflect-metadata";
import { DataSource, DataSourceOptions } from "typeorm";

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

export default new DataSource(dataSourceOptions);
