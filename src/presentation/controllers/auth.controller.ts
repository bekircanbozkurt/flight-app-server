import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from 'src/application/services/auth/auth.service';
import { LoginDto } from '../dtos/auth/login.dto';
import { LoginResponseDto } from '../dtos/auth/login-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<LoginResponseDto> {
    const authResponse = await this.authService.login(
      loginDto.email,
      loginDto.password,
    );

    // Set HttpOnly cookie with the access token
    response.cookie('access_token', authResponse.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Only send cookie over HTTPS in prod
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000, // 24hours
    });

    // Return user info without the access token
    return { user: authResponse.user };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) response: Response): Promise<void> {
    // Clear the HttpOnly cookie by setting an empty value and immediate expiration
    response.cookie('access_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
    });
  }
}
