import { Admin } from '@/modules/admins/schemas/admin.schema';
import { Document, Types } from 'mongoose';

export type AdminType = Document<unknown, object, Admin> &
  Admin & { _id: Types.ObjectId };
