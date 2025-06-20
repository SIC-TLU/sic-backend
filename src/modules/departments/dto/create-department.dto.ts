import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateDepartmentDto {
  @ApiProperty({ example: 'Khoa Công nghệ thông tin' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'cntt@tlu.edu.vn', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: '0912345678', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'https://facebook.com/cntt', required: false })
  @IsOptional()
  @IsUrl()
  facebook?: string;
}
