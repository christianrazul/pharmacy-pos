import type { Request } from 'express';

export interface AuthenticatedUser {
  id: string;
  username: string;
  email: string | null;
  role: 'CENTRAL_ADMIN';
}

export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}
