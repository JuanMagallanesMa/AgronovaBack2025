import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Timestamp } from 'firebase-admin/firestore';
import { StringValue } from 'ms';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { IUser } from './users/interfaces/user.interface';
import { UserService } from './users/user.service';

export interface AuthJwtPayload {
  sub: string;
  correo: string;
  rol?: string;
  estado?: string;
}

export interface LoginResponse {
  accessToken: string;
  user: {
    id: string;
    nombre: string;
    correo: string;
    rol: string;
    estado: string;
  };
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async login(loginDto: LoginDto): Promise<LoginResponse> {
    const correoNormalizado = loginDto.correo.trim().toLowerCase();
    const usuario = await this.userService.findByCorreoNormalizado(correoNormalizado);

    if (!usuario || usuario.estado !== 'Activo') {
      throw new UnauthorizedException('Credenciales invalidas');
    }

    const contrasenaValida = await bcrypt.compare(loginDto.contrasena, usuario.contrasenaHash);

    if (!contrasenaValida) {
      throw new UnauthorizedException('Credenciales invalidas');
    }

    const accessToken = await this.signToken({
      sub: usuario.id,
      correo: usuario.correo,
      rol: usuario.rol,
      estado: usuario.estado,
    });

    const response: LoginResponse = {
      accessToken,
      user: this.toPublicUser(usuario),
    };

    try {
      await this.userService.updateUltimoAcceso(usuario.id, Timestamp.now());
    } catch (error) {
      this.logger.error(
        `No se pudo actualizar ultimoAcceso para el usuario ${usuario.id}`,
        error instanceof Error ? error.stack : undefined,
      );
    }

    return response;
  }

  signToken(payload: AuthJwtPayload): Promise<string> {
    const secret = this.configService.get<string>('JWT_SECRET') ?? 'change-me';
    const expiresIn = (this.configService.get<string>('JWT_EXPIRES_IN') ?? '8h') as StringValue;

    return this.jwtService.signAsync(payload, {
      secret,
      expiresIn,
    });
  }

  private toPublicUser(usuario: IUser): LoginResponse['user'] {
    return {
      id: usuario.id,
      nombre: usuario.nombre,
      correo: usuario.correo,
      rol: usuario.rol,
      estado: usuario.estado,
    };
  }
}
