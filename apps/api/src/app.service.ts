import { Injectable } from "@nestjs/common";

export interface AppInfoDto {
  name: string;
  status: "ready";
}

@Injectable()
export class AppService {
  getInfo(): AppInfoDto {
    return {
      name: "weiqing-api",
      status: "ready"
    };
  }
}
