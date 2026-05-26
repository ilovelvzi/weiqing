import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor
} from "@nestjs/common";
import { Observable, map } from "rxjs";

interface ApiSuccessEnvelope<T> {
  success: true;
  data: T;
  message?: string;
  timestamp: string;
  path: string;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiSuccessEnvelope<T>> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<ApiSuccessEnvelope<T>> {
    const request = context.switchToHttp().getRequest<{ url: string }>();

    return next.handle().pipe(
      map((data) => ({
        success: true,
        data,
        timestamp: new Date().toISOString(),
        path: request.url
      }))
    );
  }
}
