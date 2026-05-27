import { registerAs } from "@nestjs/config";

export interface JwtConfig {
  accessSecret: string;
  refreshSecret: string;
  accessExpiresIn: string;
  refreshExpiresIn: string;
}

export default registerAs("jwt", (): JwtConfig => {
  const accessSecret = process.env.JWT_ACCESS_SECRET;
  const refreshSecret = process.env.JWT_REFRESH_SECRET;

  if (!accessSecret) {
    throw new Error(
      "JWT_ACCESS_SECRET is required. Add it to apps/api/.env or root .env (see .env.example)"
    );
  }
  if (!refreshSecret) {
    throw new Error(
      "JWT_REFRESH_SECRET is required. Add it to apps/api/.env or root .env (see .env.example)"
    );
  }

  return {
    accessSecret,
    refreshSecret,
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? "15m",
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? "30d"
  };
});
