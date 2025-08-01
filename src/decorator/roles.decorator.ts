import { SetMetadata } from '@nestjs/common';

export enum Role {
  User = 'USER',
  ClubMember = 'CLUB_MEMBER',
  ClubCommitteHeads = 'CLUB_COMMITTEE_HEADS',
  Admin = 'ADMIN',
  SuperAdmin = 'SUPER_ADMIN',
}

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
