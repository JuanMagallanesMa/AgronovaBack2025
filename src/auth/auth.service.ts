import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { StringValue } from 'ms';

export interface AuthJwtPayload {
  sub: string;
  correo: string;
  rol?: string;
  estado?: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  signToken(payload: AuthJwtPayload): Promise<string> {
    const secret = this.configService.get<string>('JWT_SECRET') ?? 'change-me';
    const expiresIn = (this.configService.get<string>('JWT_EXPIRES_IN') ?? '8h') as StringValue;

    return this.jwtService.signAsync(payload, {
      secret,
      expiresIn,
    });
  }
}
