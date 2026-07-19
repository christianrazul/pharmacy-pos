import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import type { AuthenticatedRequest, AuthenticatedUser } from './auth.types';
import { LoginDto } from './login.dto';
import { SessionGuard } from './session.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  async login(
    @Body() input: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ user: AuthenticatedUser }> {
    const session = await this.authService.login(
      input.username,
      input.password,
    );

    response.cookie(cookieName(), session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: session.expiresAt,
      path: '/',
    });

    return { user: session.user };
  }

  @Get('me')
  @UseGuards(SessionGuard)
  getCurrentUser(@Req() request: AuthenticatedRequest): {
    user: AuthenticatedUser;
  } {
    return { user: request.user };
  }

  @Post('logout')
  @HttpCode(204)
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    const name = cookieName();
    const token = request.cookies?.[name] as string | undefined;

    await this.authService.logout(token);
    response.clearCookie(name, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });
  }
}

function cookieName(): string {
  return process.env.SESSION_COOKIE_NAME ?? 'pharmacy_pos_session';
}
