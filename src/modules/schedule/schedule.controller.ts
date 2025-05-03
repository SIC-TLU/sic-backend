import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { LoginToGetSchedule } from './dto/login-to-get-schedule.dto';
import { Public, ResponseMessage } from '@/decorator/customize';
import { GetSchedule } from './dto/get-schedule.dto';

@Controller('schedules')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Public()
  @Post('login')
  @ResponseMessage('Login successfully')
  create(@Body() loginToGetSchedule: LoginToGetSchedule) {
    return this.scheduleService.create(loginToGetSchedule);
  }

  @Post()
  @Public()
  @HttpCode(200)
  @ResponseMessage('Get schedule successfully')
  getSchedule(@Body() getSchedule: GetSchedule) {
    return this.scheduleService.getSchedule(getSchedule);
  }
}
