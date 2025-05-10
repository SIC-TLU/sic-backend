import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { LoginToGetSchedule } from './dto/login-to-get-schedule.dto';
import { GetSchedule } from './dto/get-schedule.dto';
import { Public, ResponseMessage } from '@/decorator/customize';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Schedules')
@Controller('schedules')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Public()
  @ApiOperation({ summary: 'Login to obtain tokens for schedule access' })
  @ApiBody({ type: LoginToGetSchedule })
  @ApiBadRequestResponse({ description: 'Invalid login credentials' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @Post('login')
  @ResponseMessage('Login successfully')
  async create(@Body() loginToGetSchedule: LoginToGetSchedule) {
    return this.scheduleService.create(loginToGetSchedule);
  }

  @Public()
  @ApiOperation({
    summary: 'Get user schedule using access and refresh tokens',
  })
  @ApiBody({ type: GetSchedule })
  @ApiBadRequestResponse({ description: 'Invalid or missing tokens' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized or invalid tokens' })
  @Post()
  @HttpCode(200)
  @ResponseMessage('Get schedule successfully')
  async getSchedule(@Body() getSchedule: GetSchedule) {
    return this.scheduleService.getSchedule(getSchedule);
  }
}
