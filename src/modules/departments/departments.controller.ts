import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { DepartmentsService } from './departments.service';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Department } from './schemas/department.schema';
import { Public, ResponseMessage } from '@/decorator/customize';
import { Role, Roles } from '@/decorator/roles.decorator';

@Controller('departments')
export class DepartmentsController {
  constructor(private readonly departmentService: DepartmentsService) {}

  @Post()
  @ApiBearerAuth()
  @Roles(Role.SuperAdmin)
  @ApiOperation({ summary: 'Create a new department' })
  @ResponseMessage('Create department successfully')
  @ApiResponse({
    status: 201,
    description: 'The department has been successfully created.',
    type: Department,
  })
  create(@Body() reqeust: CreateDepartmentDto) {
    return this.departmentService.create(reqeust);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Get all departments' })
  @ResponseMessage('Get list of departments successfully')
  findAll() {
    return this.departmentService.findAll();
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get department by ID' })
  @ResponseMessage('Get department successfully')
  findOne(@Param('id') id: string) {
    return this.departmentService.findOne(id);
  }

  @Put(':id')
  @ApiBearerAuth()
  @Roles(Role.SuperAdmin)
  @ApiOperation({ summary: 'Update department by ID' })
  @ResponseMessage('Update department successfully')
  update(@Param('id') id: string, @Body() dto: UpdateDepartmentDto) {
    return this.departmentService.update(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Roles(Role.SuperAdmin)
  @ResponseMessage('Delete department successfully')
  @ApiOperation({ summary: 'Delete department by ID' })
  remove(@Param('id') id: string) {
    return this.departmentService.remove(id);
  }
}
