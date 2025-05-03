import { Injectable } from '@nestjs/common';
import { UsersService } from '@/modules/users/users.service';
import { LoginDto } from './dto/login.dto';
import { ScheduleService } from '@/schedule/schedule.service';
import { JwtService } from '@nestjs/jwt';
import { GENDER } from '@/constant';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly scheduleService: ScheduleService,
    private readonly jwtService: JwtService,
  ) {}

  async login({ studentCode, password }: LoginDto) {
    const response = await this.scheduleService.create({
      username: studentCode,
      password,
    });

    let foundUser = await this.usersService.findByStudentCode(studentCode);

    if (!foundUser) {
      const responseUser = await this.scheduleService.getCurrentUser({
        accessToken: response.access_token,
      });

      foundUser = await this.usersService.create({
        studentCode: responseUser.user.username,
        name: responseUser.displayName,
        email: responseUser.email,
        phoneNumber: responseUser.phoneNumber,
        gender: responseUser.gender === 'M' ? GENDER.male : GENDER.female,
        class: responseUser.enrollmentClass.className,
        homeTown: responseUser.birthPlace,
        image: responseUser.photo,
      });
    }

    const { _id, email } = foundUser;
    const payload = { email, sub: _id };

    return {
      user: {
        _id,
        email,
      },
      accessToken: this.jwtService.sign(payload),
    };
  }
}
