import { Controller, Post, Body } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { ResponseMessage } from '@/decorator/customize';
import { Role, Roles } from '@/decorator/roles.decorator';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @Roles(Role.Admin, Role.User)
  @ResponseMessage('Create post successfully')
  create(@Body() createPostDto: CreatePostDto) {
    return this.postService.create(createPostDto);
  }
}
