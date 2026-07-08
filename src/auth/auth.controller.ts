import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { CookieOptions, Response } from 'express';
import { AuthService } from './auth.service';
import type {
  AuthJwtPayload,
  AuthSuccessResponse,
  LoginResponse,
} from './auth.service';
import { AUTH_COOKIE_NAME } from './auth.constants';
import { AuthRateLimit } from './decorators/auth-rate-limit.decorator';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { AuthRateLimitGuard } from './guards/auth-rate-limit.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('v1/auth')
@UseGuards(AuthRateLimitGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @AuthRateLimit({ limit: 5, windowMs: 60 * 1000 })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<LoginResponse> {
    const loginResponse = await this.authService.login(loginDto);
    this.setAuthCookie(response, loginResponse.accessToken);
    return loginResponse;
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response): AuthSuccessResponse {
    response.clearCookie(AUTH_COOKIE_NAME, this.getAuthCookieOptions());
    return { message: 'Sesion cerrada correctamente.' };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@Req() request: { user: AuthJwtPayload }): Promise<LoginResponse['user']> {
    return this.authService.getCurrentUser(request.user);
  }

  @Post('register')
  @AuthRateLimit({ limit: 3, windowMs: 60 * 60 * 1000 })
  register(@Body() registerDto: RegisterDto): Promise<AuthSuccessResponse> {
    return this.authService.register(registerDto);
  }

  @Post('forgot-password')
  @AuthRateLimit({ limit: 3, windowMs: 15 * 60 * 1000 })
  forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ): Promise<AuthSuccessResponse> {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  @AuthRateLimit({ limit: 5, windowMs: 15 * 60 * 1000 })
  resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<AuthSuccessResponse> {
    return this.authService.resetPassword(resetPasswordDto);
  }

  private setAuthCookie(response: Response, token: string): void {
    response.cookie(AUTH_COOKIE_NAME, token, this.getAuthCookieOptions());
  }

  private getAuthCookieOptions(): CookieOptions {
    const secure = process.env.NODE_ENV === 'production';

    return {
      httpOnly: true,
      path: '/',
      sameSite: secure ? 'none' : 'lax',
      secure,
    };
  }
}
