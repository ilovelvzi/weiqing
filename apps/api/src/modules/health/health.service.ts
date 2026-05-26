import { Injectable } from "@nestjs/common";

export interface HealthStatusDto {
  status: "ok";
  service: string;
  timestamp: string;
}

@Injectable()
export class HealthService {
  getStatus(): HealthStatusDto {
    return {
      status: "ok",
      service: "weiqing-api",
      timestamp: new Date().toISOString()
    };
  }
}
