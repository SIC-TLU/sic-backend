import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { comparePassword, hashPassword } from '@/helpers';
import { AdminType } from './auth';
import { JwtService } from '@nestjs/jwt';
import { ResendCodeDto } from './dto/resend-code.dto';
import { RedisService } from '@/modules/redis/redis.service';
import { MailerService } from '@nestjs-modules/mailer';
import { generateCode } from '@/utils';
import { TokenService } from '@/modules/token/token.service';
import { AdminsService } from '@/modules/admins/admins.service';
import { AdminRepo } from '@/modules/admins/admins.repo';
import { RefreshTokenRepo } from '@/modules/token/token.repo';
import { CreateRefreshTokenDto } from '@/modules/token/dto/create-refreshToken.dto';
import { validate } from 'class-validator';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly adminsService: AdminsService,
    private readonly adminRepo: AdminRepo,
    private readonly refreshTokenRepo: RefreshTokenRepo,
    private tokenService: TokenService,
    private jwtService: JwtService,
    private redisService: RedisService,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.adminRepo.findByEmail({ email });
    if (!user) return null;

    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) return null;

    return user;
  }

  async login(user: AdminType) {
    const { _id, email, username, role } = user;
    const payload = { email, sub: _id, role };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRES_IN'), // Expiration for accessToken
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRES_IN'), // Expiration for refreshToken
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
        username,
      },
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  async logout(userId: string) {
    const hasUser = await this.adminRepo.findOneById(userId);
    if (!hasUser) throw new BadRequestException('User not found');

    const hasToken = await this.refreshTokenRepo.findOneByUserId(userId);
    if (!hasToken) throw new BadRequestException('User is already logged out');

    // Delete the refresh token
    await hasToken.deleteOne();

    return {};
  }

  async resendCode(resendCodeDto: ResendCodeDto) {
    return this.adminsService.resendCode(resendCodeDto);
  }

  async sendResetPasswordEmail(email: string) {
    const TIME_ONE_HOUR = 3600;
    const foundUser = await this.adminRepo.findByEmail({ email });
    if (!foundUser)
      throw new BadRequestException('User with this email does not exist.');

    const code = generateCode();
    const ttl = TIME_ONE_HOUR; // code expiration time in seconds (1 hour)

    // Cache code in Redis
    await this.redisService.set(`reset-password:${email}`, code, ttl);

    // Send mail
    this.mailerService.sendMail({
      to: foundUser.email, // List to reciver
      subject: 'BoBo Password Reset', // Subject line
      template: 'forgotPassword',
      context: {
        name: foundUser?.username ?? foundUser?.email,
        resetCode: code,
      },
    });

    return { message: 'Password reset email sent.' };
  }

  async checkValidCode(code: string, email: string) {
    const TIME_ONE_HOUR = 3600;
    if (!code) throw new BadRequestException('Invalid or expired code.');

    const cachedCode = await this.redisService.get(`reset-password:${email}`);
    if (!cachedCode || cachedCode !== code)
      throw new BadRequestException('Invalid or expired code.');

    const token = this.jwtService.sign({ email });
    const ttl = TIME_ONE_HOUR;

    // Delete code has use in Redis
    await this.redisService.del(`reset-password:${email}`);

    // Cache token in Redis
    await this.redisService.set(`reset-password-token:${email}`, token, ttl);

    return { token };
  }

  async resetPassword(token: string, newPassword: string) {
    let email: string;

    // Decode token to extract email
    try {
      const decoded = this.jwtService.verify(token);
      email = decoded.email;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token.');
    }

    // Verify token from Redis
    const cachedToken = await this.redisService.get(
      `reset-password-token:${email}`,
    );
    if (!cachedToken || cachedToken !== token)
      throw new UnauthorizedException('Invalid or expired token.');

    const user = await this.adminRepo.findByEmail({ email });
    if (!user) throw new BadRequestException('User does not exist.');

    user.password = await hashPassword(newPassword);
    await user.save();

    // Remove token from Redis after successful password reset
    await this.redisService.del(`reset-password-token:${email}`);

    return { message: 'Password reset successfully.' };
  }

  async handleRefreshToken(userId: string, refreshToken: string) {
    const hasToken = await this.refreshTokenRepo.findOneByUserId(userId);
    if (!hasToken) throw new UnauthorizedException('Invalid refresh token');

    // Compare stored refreshToken with provided one
    if (hasToken.token !== refreshToken)
      throw new UnauthorizedException('Invalid refresh token');

    const hasUser: any = await this.adminRepo.findOneById(userId);

    const payload = { email: hasUser.email, sub: hasUser._id };

    const newAccessToken = await this.jwtService.signAsync(payload, {
      expiresIn: this.configService.get<string>('JWT_ACCESS_TOKEN_EXPIRES_IN'), // Expiration for accessToken
    });

    const newRefreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: this.configService.get<string>('JWT_REFRESH_TOKEN_EXPIRES_IN'), // Expiration for refreshToken
    });

    // Store refreshToken in the database
    await this.tokenService.handleRefreshToken(newRefreshToken);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }
}
