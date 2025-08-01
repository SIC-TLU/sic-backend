import { config } from 'dotenv';
config();

export const ROLES = {
  USER: process.env.ROLE_USER || 'User',
  CLUB_MEMBER: process.env.ROLE_CLUBMEMBER || 'ClubMember',
  CLUB_COMMITTEE_HEADS:
    process.env.ROLE_CLUBCOMMITTEHEADS || 'ClubCommitteHeads',
  ADMIN: process.env.ROLE_ADMIN || 'Admin',
  SUPER_ADMIN: process.env.ROLE_SUPERADMIN || 'SuperAdmin',
};

export const STATUS_USER = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  PENDING: 'PENDING',
  BANNED: 'BANNED',
};

export const GENDER = {
  MALE: 'MALE',
  FEMALE: 'FEMALE',
};

export const STATUS_POST = {
  PUBLIC: 'PUBLIC',
  DRAFT: 'DRAFT',
  DELETED: 'DELETED',
};
