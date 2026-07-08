import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AUTH_COOKIE_NAME } from '../auth.constants';
import { AuthJwtPayload } from '../auth.service';

interface JwtRequest {
  headers?: {
    cookie?: string;
  };
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJwtFromCookie,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  validate(payload: AuthJwtPayload): AuthJwtPayload {
    return payload;
  }

  private static extractJwtFromCookie(
    request: JwtRequest | undefined,
  ): string | null {
    const cookieHeader = request?.headers?.cookie;

    if (!cookieHeader) {
      return null;
    }

    const rawCookie = cookieHeader
      .split(';')
      .map((cookie) => cookie.trim())
      .find((cookie) => cookie.startsWith(`${AUTH_COOKIE_NAME}=`));

    if (!rawCookie) {
      return null;
    }

    const token = rawCookie.slice(AUTH_COOKIE_NAME.length + 1);

    try {
      return decodeURIComponent(token);
    } catch {
      return token;
    }
  }
}
