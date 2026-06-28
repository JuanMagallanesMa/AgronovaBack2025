import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Timestamp } from 'firebase-admin/firestore';
import { StringValue } from 'ms';
import * as bcrypt from 'bcrypt';
import { createHash, randomBytes } from 'crypto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
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

export interface AuthSuccessResponse {
  message: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private static readonly defaultRole = 'Usuario';
  private static readonly activeStatus = 'Activo';
  private static readonly resetPasswordTtlMs = 60 * 60 * 1000;

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

  async register(registerDto: RegisterDto): Promise<AuthSuccessResponse> {
    const correoNormalizado = registerDto.correo.trim().toLowerCase();
    const usuarioExistente = await this.userService.findByCorreoNormalizado(correoNormalizado);

    if (usuarioExistente) {
      throw new ConflictException('Ya existe una cuenta registrada con ese correo.');
    }

    const contrasenaHash = await bcrypt.hash(registerDto.contrasena, 10);

    await this.userService.create({
      nombre: registerDto.nombre.trim(),
      correo: registerDto.correo.trim(),
      correoNormalizado,
      contrasenaHash,
      rol: AuthService.defaultRole,
      estado: AuthService.activeStatus,
    });

    return {
      message: 'Cuenta creada correctamente. Ya puedes iniciar sesion.',
    };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<AuthSuccessResponse> {
    const correoNormalizado = forgotPasswordDto.correo.trim().toLowerCase();
    const usuario = await this.userService.findByCorreoNormalizado(correoNormalizado);

    if (!usuario || usuario.estado !== AuthService.activeStatus) {
      return {
        message: 'Si el correo existe, enviaremos un enlace de recuperacion.',
      };
    }

    const token = randomBytes(32).toString('hex');
    const tokenHash = this.hashToken(token);
    const resetPasswordRequestedAt = Timestamp.now();
    const resetPasswordExpiresAt = Timestamp.fromDate(
      new Date(Date.now() + AuthService.resetPasswordTtlMs),
    );

    await this.userService.setResetPasswordToken(
      usuario.id,
      tokenHash,
      resetPasswordExpiresAt,
      resetPasswordRequestedAt,
    );

    await this.sendResetPasswordEmail(usuario, token);

    return {
      message: 'Si el correo existe, enviaremos un enlace de recuperacion.',
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<AuthSuccessResponse> {
    const token = resetPasswordDto.token.trim();

    if (!token) {
      throw new BadRequestException('El enlace de recuperacion no es valido.');
    }

    const tokenHash = this.hashToken(token);
    const usuario = await this.userService.findByResetPasswordTokenHash(tokenHash);

    if (!usuario?.resetPasswordExpiresAt) {
      throw new BadRequestException('El enlace de recuperacion no es valido.');
    }

    if (usuario.resetPasswordExpiresAt.toMillis() < Date.now()) {
      throw new BadRequestException('El enlace de recuperacion ha expirado.');
    }

    const contrasenaHash = await bcrypt.hash(resetPasswordDto.contrasena, 10);
    await this.userService.updatePasswordAndClearResetToken(usuario.id, contrasenaHash);

    return {
      message: 'Contrasena actualizada correctamente. Ya puedes iniciar sesion.',
    };
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

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  private async sendResetPasswordEmail(usuario: IUser, token: string): Promise<void> {
    const resendApiKey = this.configService.get<string>('RESEND_API_KEY');
    const resendFromEmail = this.configService.get<string>('RESEND_FROM_EMAIL');
    const frontendUrl = this.configService.get<string>('FRONTEND_URL');

    if (!resendApiKey || !resendFromEmail || !frontendUrl) {
      throw new InternalServerErrorException(
        'La recuperacion de contrasena no esta configurada correctamente.',
      );
    }

    const resetUrl = `${frontendUrl.replace(/\/$/, '')}/auth/reset-password?token=${encodeURIComponent(token)}`;
    const payload = {
      from: resendFromEmail,
      to: [usuario.correo],
      subject: 'Recupera tu contrasena de Agronova',
      html: `
        <p>Hola ${usuario.nombre},</p>
        <p>Recibimos una solicitud para restablecer tu contrasena.</p>
        <p><a href="${resetUrl}">Restablecer contrasena</a></p>
        <p>Si no solicitaste este cambio, puedes ignorar este correo.</p>
        <p>El enlace vence en 1 hora.</p>
      `,
    };

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      this.logger.error(`Resend devolvio ${response.status} al enviar recuperacion: ${errorBody}`);
      throw new InternalServerErrorException('No se pudo enviar el correo de recuperacion.');
    }
  }
}
