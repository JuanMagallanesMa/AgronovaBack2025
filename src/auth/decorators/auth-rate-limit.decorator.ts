import { SetMetadata } from '@nestjs/common';

export interface AuthRateLimitPolicy {
  limit: number;
  windowMs: number;
}

export const AUTH_RATE_LIMIT_METADATA = 'auth-rate-limit';

export const AuthRateLimit = (policy: AuthRateLimitPolicy) =>
  SetMetadata(AUTH_RATE_LIMIT_METADATA, policy);
