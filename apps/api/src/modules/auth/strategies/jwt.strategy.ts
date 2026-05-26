import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload, JwtUser } from "../../../common/types";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
  constructor(configService: ConfigService) {
    const secret = configService.get<string>("jwt.accessSecret");

    if (!secret) {
      throw new Error("JWT_ACCESS_SECRET is required");
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret
    });
  }

  validate(payload: JwtPayload): JwtUser {
    if (!payload.sub || !payload.email || !payload.status) {
      throw new UnauthorizedException("Invalid token payload");
    }

    return {
      id: payload.sub,
      email: payload.email,
      status: payload.status
    };
  }
}
