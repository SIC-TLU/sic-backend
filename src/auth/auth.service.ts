import { VerifyAccountDto } from './dto/verify-account.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '@/modules/users/users.service';
import { comparePassword } from '@/helpers';
import { UserType } from './auth';
import { JwtService } from '@nestjs/jwt';
import { CreateAuthDto } from './dto/create-auth.dto';
import dayjs from 'dayjs';

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
      accessToken: this.jwtService.sign(payload),
    };
  }

  async handleRegister(registerDto: CreateAuthDto) {
    return await this.usersService.handleRegister(registerDto);
  }

  async verifyAccount(verifyAccountDto: VerifyAccountDto) {
    const { username, codeId } = verifyAccountDto;

    const foundUser = await this.usersService.findOneByUsername(username);
    if (!foundUser) throw new BadRequestException();

    if (codeId !== foundUser.codeId)
      throw new BadRequestException('The code invalid or expried!');
    if (!dayjs().isBefore(foundUser.codeExpired))
      throw new BadRequestException('The code invalid or expried!');

    await foundUser.updateOne({ isActive: true });

    return {};
  }
}
