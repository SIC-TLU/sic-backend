import { IsMongoId, IsNotEmpty, MinLength } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  @IsMongoId()
  userId: string;

  @IsNotEmpty()
  @MinLength(3)
  title: string;

  @IsNotEmpty()
  @MinLength(20)
  content: string;
}
