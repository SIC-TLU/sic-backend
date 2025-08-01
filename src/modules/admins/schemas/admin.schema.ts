import { ROLES, STATUS_USER } from '@/constant';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Admin {
  @Prop()
  fullName: string;

  @Prop()
  username: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop({ type: String, default: null })
  phoneNumber: string | null;

  @Prop({ type: String, default: null })
  image: string | null;

  @Prop({ type: String, default: null })
  address: string | null;

  @Prop({ default: ROLES.SUPER_ADMIN })
  role: string;

  @Prop({ enum: STATUS_USER, default: STATUS_USER.ACTIVE })
  status: string;

  @Prop({ default: false })
  isActive: boolean;

  @Prop()
  codeId: string;

  @Prop()
  codeExpired: Date;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
