import { Public, ResponseMessage } from '@/decorator/customize';
import {
  Body,
  Controller,
  HttpCode,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { LocalAuthGuard } from './passport/local-auth.guard';
import { AuthService } from './authAdmin.service';
import { ResendCodeDto } from './dto/resend-code.dto';
import { RequestWithAdmin } from '@/common/interfaces/request-with-user.interface';

@ApiTags('Authentication Admin') // Swagger category
@Controller('auth/admin')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: 'User Login' })
  @ApiResponse({ status: 200, description: 'Login successfully' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string' },
        password: { type: 'string' },
      },
      required: ['username', 'password'],
    },
  })
  @ResponseMessage('Login successfully')
  async handleLogin(@Request() req: RequestWithAdmin) {
    return this.authService.login(req.user);
  }

  @Public()
  @Post('resend-code')
  @HttpCode(200)
  @ApiOperation({ summary: 'Resend Verification Code' })
  @ApiResponse({ status: 200, description: 'Resend code successfully' })
  @ApiBody({ type: ResendCodeDto })
  @ResponseMessage('Resend code successfully')
  resendCode(@Body() resendCodeDto: ResendCodeDto) {
    return this.authService.resendCode(resendCodeDto);
  }

  @Public()
  @Post('forgot-password')
  @HttpCode(200)
  @ApiOperation({ summary: 'Forgot Password' })
  @ApiResponse({ status: 200, description: 'Recovery account successfully' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', format: 'email' },
      },
      required: ['email'],
    },
  })
  @ResponseMessage('Recovery account successfully')
  forgotPassword(@Body('email') email: string) {
    return this.authService.sendResetPasswordEmail(email);
  }

  @Public()
  @Post('check-validcode')
  @HttpCode(200)
  @ApiOperation({ summary: 'Check Verification Code' })
  @ApiResponse({ status: 200, description: 'Check valid code successfully' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', format: 'email' },
        code: { type: 'string' },
      },
      required: ['email', 'code'],
    },
  })
  @ResponseMessage('Check valid code successfully')
  checkValidCode(@Body('email') email: string, @Body('code') code: string) {
    return this.authService.checkValidCode(code, email);
  }

  @Public()
  @Post('reset-password')
  @HttpCode(200)
  @ApiOperation({ summary: 'Reset Password' })
  @ApiResponse({ status: 200, description: 'Reset password successfully' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        newPassword: { type: 'string' },
        token: { type: 'string' },
      },
      required: ['newPassword', 'token'],
    },
  })
  @ResponseMessage('Reset password successfully')
  resetPassword(
    @Body('newPassword') newPass: string,
    @Body('token') token: string,
  ) {
    return this.authService.resetPassword(token, newPass);
  }

  @Post('refresh-token')
  @HttpCode(200)
  @ApiOperation({ summary: 'Refresh Token' })
  @ApiResponse({ status: 200, description: 'Refresh token successfully' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'string' },
        refreshToken: { type: 'string' },
      },
      required: ['userId', 'refreshToken'],
    },
  })
  @ResponseMessage('Refresh token successfully')
  refreshToken(
    @Body('userId') userId: string,
    @Body('refreshToken') refreshToken: string,
  ) {
    return this.authService.handleRefreshToken(userId, refreshToken);
  }

  @ApiBearerAuth()
  @Post('logout')
  @ApiOperation({ summary: 'User Logout' })
  @ApiResponse({ status: 200, description: 'Logout successfully' })
  @ResponseMessage('Logout successfully')
  async logout(@Request() req: any) {
    const userId = req.user._id;
    return this.authService.logout(userId);
  }
}
