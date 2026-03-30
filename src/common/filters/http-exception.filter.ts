import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { buildErrorResponse, getStatusMessage } from '../../utils/response';

type HttpExceptionPayload = {
  message?: string | string[];
  error?: string;
  [key: string]: unknown;
};

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<FastifyRequest>();
    const reply = ctx.getResponse<FastifyReply>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : null;

    const message = this.resolveErrorMessage(exceptionResponse, status);

    const errorDetail =
      typeof exceptionResponse === 'object' && exceptionResponse !== null
        ? exceptionResponse
        : undefined;

    reply.status(status).send(
      buildErrorResponse({
        statusCode: status,
        path: request.url,
        message,
        error: errorDetail,
      }),
    );
  }

  private resolveErrorMessage(
    exceptionResponse: unknown,
    status: number,
  ): string {
    if (typeof exceptionResponse === 'string') {
      return exceptionResponse;
    }

    if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      const payload = exceptionResponse as HttpExceptionPayload;

      if (Array.isArray(payload.message)) {
        return payload.message.join(', ');
      }

      if (typeof payload.message === 'string' && payload.message.length > 0) {
        return payload.message;
      }

      if (typeof payload.error === 'string' && payload.error.length > 0) {
        return payload.error;
      }
    }

    return getStatusMessage(status);
  }
}
