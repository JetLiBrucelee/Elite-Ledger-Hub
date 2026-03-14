import type { Request } from "express";

export interface AuthenticatedUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  country: string | null;
  address: string | null;
  city: string | null;
  stateProvince: string | null;
  zipCode: string | null;
  role: string;
  status: string;
  plan: string | null;
  balance: string;
  createdAt: Date;
  passwordHash: string;
}

export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}
