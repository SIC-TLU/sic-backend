import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public, ResponseMessage } from './decorator/customize';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Public()
  @ResponseMessage('Get sucessfully')
  getHello(): string {
    return this.appService.getHello();
  }
}
