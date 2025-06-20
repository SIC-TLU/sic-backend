import { Module } from '@nestjs/common';
import { AuthService } from './authAdmin.service';
import { AuthController } from './authAdmin.controller';
import { LocalStrategy } from './passport/local.strategy';
import { UsersModule } from '@/modules/users/users.module';
import { JwtStrategy } from './passport/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { RedisModule } from '@/modules/redis/redis.module';
import { TokenModule } from '@/modules/token/token.module';
import { AdminsModule } from '@/modules/admins/admins.module';

@Module({
  imports: [
    UsersModule,
    AdminsModule,
    TokenModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (confgiService: ConfigService) => ({
        global: true,
        secret: confgiService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: confgiService.get<string>('JWT_ACCESS_TOKEN_EXPIRED'),
        },
      }),
      inject: [ConfigService],
    }),
    PassportModule,
    RedisModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthAdminModule {}
