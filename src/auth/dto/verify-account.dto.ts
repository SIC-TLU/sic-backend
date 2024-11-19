import { IsNotEmpty } from 'class-validator';

export class VerifyAccountDto {
  @IsNotEmpty()
  _id: string;

  @IsNotEmpty()
  codeId: string;
}
