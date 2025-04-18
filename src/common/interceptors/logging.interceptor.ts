import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, headers } = request;
    const userAgent = headers['user-agent'] || 'unknown';
    const userId = headers['x-user-id'] || 'anonymous';

    this.logger.log(
      `Request: ${method} ${url} - User: ${userId} - UserAgent: ${userAgent}`,
    );

    const now = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          this.logger.log(
            `Response: ${method} ${url} - ${Date.now() - now}ms - Status: Success`,
          );
        },
        error: (error) => {
          this.logger.error(
            `Response: ${method} ${url} - ${Date.now() - now}ms - Status: Error: ${error.message}`,
          );
        },
      }),
    );
  }
}
