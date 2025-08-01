import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsObject } from 'class-validator';

export class SendNotificationDto {
  @ApiProperty({ example: 'fcm_device_token_here' })
  @IsNotEmpty()
  @IsString()
  fcmToken: string;

  @ApiProperty({ example: '🔥 New promotion available!' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ example: 'Click here to see the deal.' })
  @IsNotEmpty()
  @IsString()
  body: string;

  @ApiProperty({
    example: { screen: 'promotion', promoId: '12345' },
    required: false,
  })
  @IsOptional()
  @IsObject()
  data?: Record<string, string>;
}
