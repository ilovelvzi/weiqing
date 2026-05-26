import { Injectable } from "@nestjs/common";
import { AiTone, Mood, type AiEncouragementOutput } from "@weiqing/shared";

export interface AiEncouragementInput {
  currentWeightKg: number;
  previousWeightKg: number | null;
  targetWeightKg: number | null;
  initialWeightKg: number | null;
  streakDays: number;
  totalRecords: number;
  localDate: string;
  timezone: string;
  mood: Mood | null;
  note: string | null;
  aiTonePreference: AiTone | null;
}

@Injectable()
export class AiFallbackService {
  generate(input: AiEncouragementInput): AiEncouragementOutput {
    return this.getTemplate(this.resolveTone(input));
  }

  getComfortFallback(): AiEncouragementOutput {
    return this.getTemplate(AiTone.COMFORT);
  }

  resolveTone(input: AiEncouragementInput): AiTone {
    if (input.totalRecords <= 1) {
      return AiTone.GENTLE;
    }

    if (input.streakDays === 1 && input.totalRecords > 3) {
      return AiTone.RESET;
    }

    if (input.mood === Mood.ANXIOUS || input.mood === Mood.TIRED) {
      return AiTone.COMFORT;
    }

    if (input.previousWeightKg !== null) {
      const weightChangeKg = input.currentWeightKg - input.previousWeightKg;

      if (weightChangeKg < -0.2) {
        return AiTone.CELEBRATION;
      }

      if (weightChangeKg > 0.3) {
        return AiTone.COMFORT;
      }
    }

    return input.aiTonePreference ?? AiTone.GENTLE;
  }

  private getTemplate(tone: AiTone): AiEncouragementOutput {
    switch (tone) {
      case AiTone.CELEBRATION:
        return {
          title: "\u4e00\u70b9\u70b9\u9760\u8fd1\u5566",
          message:
            "\u8fd9\u4efd\u53d8\u5316\u4e0d\u9700\u8981\u5f88\u5927\u58f0\uff0c\u4e5f\u503c\u5f97\u88ab\u770b\u89c1\u3002\u4f60\u6b63\u5728\u7528\u7a33\u5b9a\u7684\u8282\u594f\u9760\u8fd1\u81ea\u5df1\u3002",
          tone: AiTone.CELEBRATION,
          tags: ["\u7a33\u5b9a\u524d\u8fdb"]
        };
      case AiTone.COMFORT:
        return {
          title: "\u5148\u8f7b\u8f7b\u63a5\u4f4f\u4eca\u5929",
          message:
            "\u8eab\u4f53\u4f1a\u6709\u6ce2\u52a8\uff0c\u8fd9\u4e0d\u4ee3\u8868\u4f60\u505a\u5f97\u4e0d\u597d\u3002\u4eca\u5929\u613f\u610f\u8bb0\u5f55\uff0c\u5c31\u5df2\u7ecf\u5f88\u503c\u5f97\u80af\u5b9a\u3002",
          tone: AiTone.COMFORT,
          tags: ["\u63a5\u7eb3\u6ce2\u52a8"]
        };
      case AiTone.RESET:
        return {
          title: "\u91cd\u65b0\u5f00\u59cb\u4e5f\u5f88\u597d",
          message:
            "\u4e0d\u9700\u8981\u4e00\u4e0b\u5b50\u505a\u5230\u5f88\u591a\uff0c\u4eca\u5929\u8fd9\u4e00\u6761\u8bb0\u5f55\uff0c\u5c31\u662f\u91cd\u65b0\u56de\u5230\u8282\u594f\u91cc\u7684\u5f00\u59cb\u3002",
          tone: AiTone.RESET,
          tags: ["\u91cd\u65b0\u5f00\u59cb"]
        };
      case AiTone.GENTLE:
      default:
        return {
          title: "\u4eca\u5929\u4e5f\u8bb0\u5f55\u4e0b\u6765\u4e86",
          message:
            "\u4e0d\u7528\u6025\u7740\u8bc4\u4ef7\u8fd9\u4e2a\u6570\u5b57\uff0c\u80fd\u6301\u7eed\u770b\u89c1\u81ea\u5df1\uff0c\u672c\u8eab\u5c31\u662f\u4e00\u79cd\u5f88\u6e29\u67d4\u7684\u8fdb\u6b65\u3002",
          tone: AiTone.GENTLE,
          tags: ["\u6e29\u67d4\u8bb0\u5f55"]
        };
    }
  }
}
