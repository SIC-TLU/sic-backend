import { config } from 'dotenv';
config();

export const ROLES = {
  user: process.env.ROLE_USER || 'User',
  clubNember: process.env.ROLE_CLUBMEMBER || 'ClubMember',
  clubCommitteHeads: process.env.ROLE_CLUBCOMMITTEHEADS || 'ClubCommitteHeads',
  admin: process.env.ROLE_ADMIN || 'Admin',
  superAdmin: process.env.ROLE_SUPERADMIN || 'SuperAdmin',
};

export const GENDER = {
  male: 'MALE',
  female: 'FEMALE',
};

export const STATUS_POST = {
  public: 'public',
  draft: 'draft',
  deleted: 'deleted',
};
