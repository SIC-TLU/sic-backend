import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Request,
  Delete,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { ResponseMessage } from '@/decorator/customize';
import { Role, Roles } from '@/decorator/roles.decorator';
import { UpdatePostDto } from './dto/update-post.dto';
import { Request as ExpressRequest } from 'express';
import { UserType } from '@/auth/auth';
import { LikePostDto } from './dto/like-post.dto';

interface RequestWithUser extends ExpressRequest {
  user: UserType;
}

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @Roles(Role.Admin)
  @ResponseMessage('Create post successfully')
  create(@Body() createPostDto: CreatePostDto) {
    return this.postService.create(createPostDto);
  }

  @Post('like')
  @ResponseMessage('Like post successfully')
  likePost(@Request() req: RequestWithUser, @Body() likePostDto: LikePostDto) {
    return this.postService.like(req.user._id, likePostDto);
  }

  @Patch(':id')
  @Roles(Role.Admin)
  @ResponseMessage('Edit post successfully')
  edit(
    @Request() req: RequestWithUser,
    @Param('id') postId: string,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postService.edit(req.user._id, postId, updatePostDto);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  @ResponseMessage('Delete post successfully')
  delet(@Request() req: RequestWithUser, @Param('id') postId: string) {
    return this.postService.delete(req.user._id, postId);
  }
}
