import { ROLES } from '@/constant';
import { Role, ROLES_KEY } from '@/decorator/roles.decorator';
import { User } from '@/modules/users/schemas/user.schema';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest();

    if (!user || !user.role) return false;

    const isTrue = requiredRoles.some((roleName) => {
      return user.role === ROLES[roleName];
    });

    return isTrue;
  }
}
