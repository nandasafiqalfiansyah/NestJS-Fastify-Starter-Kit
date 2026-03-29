import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class RequestValidationPipe implements PipeTransform {
  transform(value: unknown, metadata: ArgumentMetadata): unknown {
    if (metadata.type !== 'body') {
      return value;
    }

    if (value === null || value === undefined) {
      throw new BadRequestException('Request body is required');
    }

    if (typeof value !== 'object' || Array.isArray(value)) {
      throw new BadRequestException('Request body must be a JSON object');
    }

    return value;
  }
}
