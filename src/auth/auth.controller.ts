import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  AuthService,
  AuthSuccessResponse,
  LoginResponse,
} from './auth.service';
import { AuthRateLimit } from './decorators/auth-rate-limit.decorator';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { AuthRateLimitGuard } from './guards/auth-rate-limit.guard';

@Controller('v1/auth')
@UseGuards(AuthRateLimitGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @AuthRateLimit({ limit: 5, windowMs: 60 * 1000 })
  login(@Body() loginDto: LoginDto): Promise<LoginResponse> {
    return this.authService.login(loginDto);
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
}
