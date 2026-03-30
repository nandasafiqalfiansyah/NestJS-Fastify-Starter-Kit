import { HttpStatus } from '@nestjs/common';

export type ApiSuccessResponse<T> = {
  success: true;
  statusCode: number;
  message: string;
  path: string;
  data: T;
};

export type ApiErrorResponse = {
  success: false;
  statusCode: number;
  message: string;
  error?: unknown;
  path: string;
};

const STATUS_MESSAGES: Record<number, string> = {
  [HttpStatus.OK]: 'OK',
  [HttpStatus.CREATED]: 'Created',
  [HttpStatus.BAD_REQUEST]: 'Bad Request',
  [HttpStatus.UNAUTHORIZED]: 'Unauthorized',
  [HttpStatus.FORBIDDEN]: 'Forbidden',
  [HttpStatus.NOT_FOUND]: 'Not Found',
  [HttpStatus.CONFLICT]: 'Conflict',
  [HttpStatus.UNPROCESSABLE_ENTITY]: 'Unprocessable Entity',
  [HttpStatus.TOO_MANY_REQUESTS]: 'Too Many Requests',
  [HttpStatus.INTERNAL_SERVER_ERROR]: 'Internal Server Error',
  [HttpStatus.BAD_GATEWAY]: 'Bad Gateway',
  [HttpStatus.SERVICE_UNAVAILABLE]: 'Service Unavailable',
  [HttpStatus.GATEWAY_TIMEOUT]: 'Gateway Timeout',
};

export function getStatusMessage(statusCode: number): string {
  return STATUS_MESSAGES[statusCode] ?? 'Unknown Error';
}

export function buildSuccessResponse<T>(params: {
  data: T;
  path: string;
  statusCode?: number;
  message?: string;
}): ApiSuccessResponse<T> {
  const statusCode = params.statusCode ?? HttpStatus.OK;

  return {
    success: true,
    statusCode,
    message: params.message ?? getStatusMessage(statusCode),
    path: params.path,
    data: params.data,
  };
}

export function buildErrorResponse(params: {
  statusCode: number;
  path: string;
  message?: string;
  error?: unknown;
}): ApiErrorResponse {
  return {
    success: false,
    statusCode: params.statusCode,
    message: params.message ?? getStatusMessage(params.statusCode),
    error: params.error,
    path: params.path,
  };
}
