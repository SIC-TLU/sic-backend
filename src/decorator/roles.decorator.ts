import { SetMetadata } from '@nestjs/common';

export enum Role {
  User = 'user',
  ClubMember = 'clubMember',
  ClubCommitteHeads = 'clubCommitteHeads',
  Admin = 'admin',
  SuperAdmin = 'superAdmin',
}

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
