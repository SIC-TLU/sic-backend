import { Public, ResponseMessage } from '@/decorator/customize';
import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiBody, ApiOperation } from '@nestjs/swagger';

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
}
