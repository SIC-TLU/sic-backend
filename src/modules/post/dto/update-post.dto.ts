import { STATUS_POST } from '@/constant';
import { IsEnum, IsOptional } from 'class-validator';
import { omit } from 'lodash';

export class UpdatePostDto {
  @IsOptional()
  title: string;

  @IsOptional()
  content: string;

  @IsOptional()
  @IsEnum(omit(STATUS_POST, ['deleted']))
  status: string;
}
