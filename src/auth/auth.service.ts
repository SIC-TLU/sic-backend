import { Injectable } from '@nestjs/common';
import { UsersService } from '@/modules/users/users.service';
import { comparePassword } from '@/helpers';
import { UserType } from './auth';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.usersService.findByUsername(username);
    if (!user) return null;

    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) return null;

    return user;
  }

  async login(user: UserType) {
    const { _id, email, username } = user;
    const payload = { email, sub: _id };

    return {
      user: {
        _id,
        email,
        username,
      },
      access_token: this.jwtService.sign(payload),
    };
  }
}
