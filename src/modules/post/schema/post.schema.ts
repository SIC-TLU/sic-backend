import { STATUS_POST } from '@/constant';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({})
export class Post {
  @Prop({ ref: 'users', type: Types.ObjectId })
  userId: string;

  @Prop({ min: 3 })
  title: string;

  @Prop({ min: 20 })
  content: string;

  @Prop({ default: STATUS_POST.public })
  status: string;

  @Prop({ default: 0 })
  likeCount: number;

  @Prop({ default: [], ref: 'users' })
  likeUserIds: string[];

  @Prop({ default: true })
  isPublic: boolean;

  @Prop({ default: false })
  isDraft: boolean;

  @Prop({ default: false })
  isDeleted: boolean;
}

export const PostSchema = SchemaFactory.createForClass(Post);
