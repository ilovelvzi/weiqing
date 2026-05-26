import { UserStatus } from "@weiqing/shared";

export interface JwtUser {
  id: string;
  email: string;
  status: UserStatus;
}

export interface JwtPayload {
  sub: string;
  email: string;
  status: UserStatus;
  iat?: number;
  exp?: number;
}
