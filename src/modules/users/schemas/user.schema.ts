import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { GENDER, ROLES } from '@/constant';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  studentCode: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ default: null })
  phoneNumber: string | null;

  @Prop({ type: String, enum: GENDER, default: null })
  gender: string | null;

  @Prop({ required: true })
  class: string;

  @Prop({ required: true })
  homeTown: string;

  @Prop({ default: null })
  image: string | null;

  @Prop({ default: false })
  isMember: boolean;

  @Prop({ type: String, enum: ROLES, default: ROLES.USER })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
