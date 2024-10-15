import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from './schema/post.schema';
import { Model } from 'mongoose';
import { getInfo } from '@/utils';

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
}
