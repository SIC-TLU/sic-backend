import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../authAdmin.service';
import { AdminType } from '../auth';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<AdminType | null> {
    const admin = await this.authService.validateUser(email, password);

    if (!admin)
      throw new UnauthorizedException('email or password not correct!');

    if (!admin.isActive)
      throw new BadRequestException('Account has not been activated!');

    return admin;
  }
}
