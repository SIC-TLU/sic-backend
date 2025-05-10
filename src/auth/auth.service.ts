import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '@/modules/users/users.service';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { GENDER } from '@/constant';
import { ScheduleService } from '@/modules/schedule/schedule.service';
import { TokenService } from '@/modules/token/token.service';
import { CreateRefreshTokenDto } from '@/modules/token/dto/create-refreshToken.dto';
import { validate } from 'class-validator';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly scheduleService: ScheduleService,
    private readonly tokenService: TokenService,
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

    // Generate access token (short-lived)
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '1d', // Access token expires in 1 day
    });

    // Generate refresh token (longer-lived)
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d', // Refresh token expires in 7 days
    });

    // Create DTO for refresh token
    const refreshTokenDto = new CreateRefreshTokenDto();
    refreshTokenDto.token = refreshToken;
    refreshTokenDto.user = _id.toString();
    refreshTokenDto.expiresAt = new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000,
    ).toISOString();
    refreshTokenDto.createdAt = new Date().toISOString();
    refreshTokenDto.refreshTokenUsed = [];

    // Validate DTO
    const errors = await validate(refreshTokenDto);
    if (errors.length > 0) {
      throw new BadRequestException('Invalid refresh token data');
    }

    // Save refresh token to MongoDB using TokenService
    await this.tokenService.saveRefreshToken(refreshTokenDto);

    return {
      user: {
        _id,
        email,
      },
      accessToken,
      refreshToken,
      response,
    };
  }

  async handleRefreshToken(refreshToken: string) {
    return await this.tokenService.handleRefreshToken(refreshToken);
  }
}
