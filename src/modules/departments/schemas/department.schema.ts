import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DepartmentDocument = Department & Document;

@Schema({ timestamps: true })
export class Department {
  @Prop({ required: true })
  name: string;

  @Prop()
  email: string;

  @Prop()
  phone: string;

  @Prop()
  facebook: string;
}

export const DepartmentSchema = SchemaFactory.createForClass(Department);
