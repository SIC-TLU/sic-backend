import { IsNotEmpty } from 'class-validator';

export class GetSchedule {
  @IsNotEmpty()
  accessToken: string;

  @IsNotEmpty()
  refreshToken: string;

  @IsNotEmpty()
  semesterId: number;
}
