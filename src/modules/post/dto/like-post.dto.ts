import { IsMongoId, IsNotEmpty } from 'class-validator';

export class LikePostDto {
  @IsNotEmpty()
  @IsMongoId()
  postId: string;
}
