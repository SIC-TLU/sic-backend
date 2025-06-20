import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Department, DepartmentDocument } from './schemas/department.schema';
import { Model } from 'mongoose';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectModel(Department.name)
    private readonly departmentModel: Model<DepartmentDocument>,
  ) {}

  create(createDepartmentDto: CreateDepartmentDto) {
    return this.departmentModel.create(createDepartmentDto);
  }

  findAll() {
    return this.departmentModel.find().exec();
  }

  findOne(id: string) {
    return this.departmentModel.findById(id).exec();
  }

  update(id: string, dto: UpdateDepartmentDto) {
    return this.departmentModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
  }

  remove(id: string) {
    return this.departmentModel.findByIdAndDelete(id).exec();
  }
}
