import { registerAs } from "@nestjs/config";

export interface CorsConfig {
  origin: string | string[];
  credentials: boolean;
}

const parseOrigin = (origin: string): string | string[] =>
  origin.includes(",") ? origin.split(",").map((item) => item.trim()) : origin;

export default registerAs(
  "cors",
  (): CorsConfig => ({
    origin: parseOrigin(process.env.CORS_ORIGIN ?? "http://localhost:10086"),
    credentials: (process.env.CORS_CREDENTIALS ?? "true") === "true"
  })
);
