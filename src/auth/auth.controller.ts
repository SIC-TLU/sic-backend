import { Public, ResponseMessage } from '@/decorator/customize';
import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { AuthService } from './auth.service';
import { UserType } from './auth';

interface RequestWithUser extends ExpressRequest {
  user: UserType;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @UseGuards(LocalAuthGuard)
  @ResponseMessage('Login successfully')
  async handleLogin(@Request() req: RequestWithUser) {
    return this.authService.login(req.user);
  }
}
