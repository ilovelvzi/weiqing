import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger
} from "@nestjs/common";
import { Request, Response } from "express";

interface ErrorPayload {
  code: string;
  message: string;
  details?: unknown;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const payload = this.buildPayload(exception, status);

    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(payload.message, exception instanceof Error ? exception.stack : undefined);
    }

    response.status(status).json({
      success: false,
      error: payload,
      timestamp: new Date().toISOString(),
      path: request.url
    });
  }

  private buildPayload(exception: unknown, status: number): ErrorPayload {
    if (exception instanceof HttpException) {
      const response = exception.getResponse();

      if (typeof response === "object" && response !== null) {
        const body = response as { error?: string; message?: string | string[] };
        return {
          code: body.error ?? `HTTP_${status}`,
          message: Array.isArray(body.message) ? body.message.join("; ") : body.message ?? exception.message,
          details: Array.isArray(body.message) ? body.message : undefined
        };
      }

      return {
        code: `HTTP_${status}`,
        message: String(response)
      };
    }

    return {
      code: "INTERNAL_SERVER_ERROR",
      message: "Internal server error"
    };
  }
}
