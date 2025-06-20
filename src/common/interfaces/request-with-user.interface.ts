import { AdminType } from '@/auth/authAdmin/auth';
import { Request } from 'express';

export interface RequestWithAdmin extends Request {
  user: AdminType;
}
