import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { FastifyReply, FastifyRequest } from 'fastify';
import { ApiSuccessResponse, buildSuccessResponse } from '../../utils/response';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
  T,
  ApiSuccessResponse<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ApiSuccessResponse<T>> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest<FastifyRequest>();
    const reply = httpContext.getResponse<FastifyReply>();
    const route = request.url;

    // Swagger UI/spec endpoints must return raw responses.
    if (
      route.startsWith('/docs') ||
      route.startsWith('/docs-json') ||
      route.startsWith('/docs-yaml')
    ) {
      return next.handle() as Observable<ApiSuccessResponse<T>>;
    }

    return next.handle().pipe(
      map((data) =>
        buildSuccessResponse({
          data,
          path: route,
          statusCode: reply.statusCode,
        }),
      ),
    );
  }
}
