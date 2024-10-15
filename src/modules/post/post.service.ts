import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from './schema/post.schema';
import { Model, Types } from 'mongoose';
import { getInfo } from '@/utils';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostService {
  constructor(@InjectModel(Post.name) private postModel: Model<Post>) {}

  async create(createPostDto: CreatePostDto) {
    const createdPost = await this.postModel.create(createPostDto);

    return getInfo({
      object: createdPost,
      fields: ['_id', 'userId', 'title', 'content'],
    });
  }

  async edit(
    userId: Types.ObjectId,
    postId: string,
    updatePostDto: UpdatePostDto,
  ) {
    const foundPost = await this.postModel.findById(postId);

    if (foundPost.userId !== userId.toString()) throw new BadRequestException();

    const update = updatePostDto;
    const options = { new: true };

    return foundPost.updateOne(update, options);
  }
}
