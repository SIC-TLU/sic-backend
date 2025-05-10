import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginToGetSchedule {
  @ApiProperty({ description: 'Username for login', example: 'student123' })
  @IsNotEmpty()
  username: string;

  @ApiProperty({ description: 'Password for login', example: 'password123' })
  @IsNotEmpty()
  password: string;
}
