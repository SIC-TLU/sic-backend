import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  studentCode: string;

  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsOptional()
  phoneNumber: string | null;

  @IsNotEmpty()
  class: string;

  @IsOptional()
  gender: string | null;

  @IsNotEmpty()
  homeTown: string;

  @IsOptional()
  image: string | null;
}
