import type { Request } from "express";

export interface AuthenticatedUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  country: string | null;
  role: string;
  status: string;
  createdAt: Date;
  passwordHash: string;
}

export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}
