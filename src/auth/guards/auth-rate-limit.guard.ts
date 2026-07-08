import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import {
  AUTH_RATE_LIMIT_METADATA,
  AuthRateLimitPolicy,
} from '../decorators/auth-rate-limit.decorator';

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

@Injectable()
export class AuthRateLimitGuard implements CanActivate {
  private readonly hits = new Map<string, RateLimitEntry>();

  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const policy = this.reflector.getAllAndOverride<AuthRateLimitPolicy>(
      AUTH_RATE_LIMIT_METADATA,
      [context.getHandler(), context.getClass()],
    );

    if (!policy) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const key = `${request.method}:${request.route?.path ?? request.path}:${this.getClientIp(request)}`;
    const now = Date.now();
    const current = this.hits.get(key);

    if (!current || current.resetAt <= now) {
      this.hits.set(key, {
        count: 1,
        resetAt: now + policy.windowMs,
      });
      return true;
    }

    if (current.count >= policy.limit) {
      throw new HttpException(
        'Demasiados intentos. Intenta de nuevo en unos minutos.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    current.count += 1;
    return true;
  }

  private getClientIp(request: Request): string {
    const forwardedFor = request.headers['x-forwarded-for'];
    if (typeof forwardedFor === 'string' && forwardedFor.trim()) {
      return forwardedFor.split(',')[0].trim();
    }

    return request.ip || request.socket.remoteAddress || 'unknown';
  }
}
