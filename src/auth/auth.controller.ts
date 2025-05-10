import { Public, ResponseMessage } from '@/decorator/customize';
import {
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @ApiBody({ type: LoginDto })
  @ApiOperation({ summary: 'User login with student code' })
  @Post('login')
  @HttpCode(200)
  @ResponseMessage('Login successfully')
  async handleLogin(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Refresh access token using refresh token' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        refreshToken: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          description: 'JWT refresh token',
        },
      },
      required: ['refreshToken'],
    },
  })
  @ApiBadRequestResponse({ description: 'Invalid refresh token' })
  @ApiUnauthorizedResponse({
    description: 'Refresh token is required or invalid',
  })
  @ResponseMessage('Refresh token successfully')
  @Post('refresh')
  async refresh(@Body('refreshToken') refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }

    return this.authService.handleRefreshToken(refreshToken);
  }
}
