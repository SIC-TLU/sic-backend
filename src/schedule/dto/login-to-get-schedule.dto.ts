import { IsNotEmpty } from 'class-validator';

export class LoginToGetSchedule {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;
}
