import { Injectable, UnauthorizedException } from '@nestjs/common';
import { hash, verify } from 'argon2';
import { positiveIntegerEnvironment } from '../config/environment';
import { PrismaService } from '../database/prisma.service';
import type { AuthenticatedUser } from './auth.types';
import { createSessionToken, digestSessionToken } from './session-token';

interface CreatedSession {
  token: string;
  expiresAt: Date;
  user: AuthenticatedUser;
}

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async login(username: string, password: string): Promise<CreatedSession> {
    const user = await this.prisma.user.findUnique({
      where: { username: normalizeUsername(username) },
    });

    if (!user) {
      await hash(password);
      throw invalidCredentials();
    }

    const passwordMatches = await verify(user.passwordHash, password);

    if (!passwordMatches) {
      throw invalidCredentials();
    }

    const token = createSessionToken();
    const expiresAt = new Date(
      Date.now() +
        positiveIntegerEnvironment('SESSION_TTL_HOURS', 12) * 60 * 60 * 1000,
    );

    await this.prisma.session.create({
      data: {
        tokenHash: digestSessionToken(token),
        userId: user.id,
        expiresAt,
      },
    });

    return {
      token,
      expiresAt,
      user: toAuthenticatedUser(user),
    };
  }

  async userForToken(token: string): Promise<AuthenticatedUser | null> {
    const session = await this.prisma.session.findFirst({
      where: {
        tokenHash: digestSessionToken(token),
        expiresAt: { gt: new Date() },
      },
      include: { user: true },
    });

    if (!session) {
      return null;
    }

    return toAuthenticatedUser(session.user);
  }

  async logout(token: string | undefined): Promise<void> {
    if (!token) {
      return;
    }

    await this.prisma.session.deleteMany({
      where: { tokenHash: digestSessionToken(token) },
    });
  }
}

function normalizeUsername(username: string): string {
  return username.trim().toLowerCase();
}

function invalidCredentials(): UnauthorizedException {
  return new UnauthorizedException('Username or password is incorrect');
}

function toAuthenticatedUser(user: {
  id: string;
  username: string;
  email: string | null;
  role: 'CENTRAL_ADMIN';
}): AuthenticatedUser {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
  };
}
