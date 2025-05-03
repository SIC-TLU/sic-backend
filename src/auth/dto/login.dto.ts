import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'yourStudentCode',
    description: 'Student code used for login',
  })
  @IsNotEmpty()
  studentCode: string;

  @ApiProperty({
    example: 'yourStudentPassword',
    description: 'Student account password',
  })
  @IsNotEmpty()
  password: string;
}
