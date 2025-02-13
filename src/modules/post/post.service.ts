import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from './schema/post.schema';
import { Model, Types } from 'mongoose';
import { getInfo } from '@/utils';
import { UpdatePostDto } from './dto/update-post.dto';
import { STATUS_POST } from '@/constant';
import { LikePostDto } from './dto/like-post.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class PostService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>,
    private usersService: UsersService,
  ) {}

  async create(createPostDto: CreatePostDto) {
    const createdPost = await this.postModel.create({
      ...createPostDto,
      status: STATUS_POST.public,
    });

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
    if (!foundPost) throw new BadRequestException('Post not found!');

    if (foundPost.userId !== userId.toString()) throw new BadRequestException();

    let update: Partial<Post> = updatePostDto;
    const options = { new: true };

    const productStatus = {
      public: {
        ...updatePostDto,
        isPublic: true,
        isDraft: false,
        isDeleted: false,
      },
      draft: {
        ...updatePostDto,
        isPublic: false,
        isDraft: true,
        isDeleted: false,
      },
    };

    if (updatePostDto.status) {
      const newUpdate = productStatus[updatePostDto.status];
      if (!newUpdate) throw new BadRequestException();

      update = newUpdate;
    }
    await foundPost.updateOne(update, options);

    return {};
  }

  async delete(userId: Types.ObjectId, postId: string) {
    const foundPost = await this.postModel.findById(postId);
    if (!foundPost) throw new BadRequestException('Post not found!');

    if (foundPost.userId !== userId.toString()) throw new BadRequestException();

    await foundPost.deleteOne();

    return {};
  }

  async like(userId: Types.ObjectId, { postId }: LikePostDto) {
    const foundUser = await this.usersService.findById(userId.toString());
    if (!foundUser) throw new BadRequestException();

    const foundPost = await this.postModel.findById(postId);
    if (!foundPost) throw new BadRequestException();

    if (
      foundPost.likeUserIds &&
      foundPost.likeUserIds.includes(userId.toString())
    ) {
      await foundPost.updateOne({
        $inc: { likeCount: -1 },
        $pull: { likeUserIds: userId },
      });
    } else {
      await foundPost.updateOne({
        $inc: { likeCount: 1 },
        $push: { likeUserIds: userId },
      });
    }

    return {};
  }
}
