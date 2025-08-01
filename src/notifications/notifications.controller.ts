import { Controller, Post, Body } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { SendNotificationDto } from './dto/send-notification.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post('send')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Send an FCM push notification to a device' })
  @ApiResponse({ status: 201, description: 'Notification sent successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request payload' })
  async sendNotification(@Body() dto: SendNotificationDto) {
    return this.notificationsService.sendNotificationToDevice(
      dto.fcmToken,
      dto.title,
      dto.body,
      dto.data || {},
    );
  }
}
