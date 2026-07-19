import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { AuthService } from './auth.service';
import type { AuthenticatedRequest } from './auth.types';

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const cookieName =
      process.env.SESSION_COOKIE_NAME ?? 'pharmacy_pos_session';
    const token = request.cookies?.[cookieName] as string | undefined;

    if (!token) {
      throw new UnauthorizedException('Authentication required');
    }

    const user = await this.authService.userForToken(token);

    if (!user) {
      throw new UnauthorizedException('Authentication required');
    }

    (request as AuthenticatedRequest).user = user;

    return true;
  }
}
