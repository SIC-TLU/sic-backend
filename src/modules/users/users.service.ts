import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { hashPassword } from '@/helpers';
import { ConfigService } from '@nestjs/config';
import aqp from 'api-query-params';
import { getInfo, isValidObjectId } from '@/utils';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private configService: ConfigService,
  ) {}

  async isUserExist(username: string) {
    const hasUser = await this.userModel.exists({ username });
    if (hasUser) return true;

    return false;
  }

  async isEmailExist(email: string) {
    const hasEmail = await this.userModel.exists({ email });
    if (hasEmail) return true;

    return false;
  }

  async create(createUserDto: CreateUserDto) {
    const { username, email, password, image } = createUserDto;

    // Check username has exist?
    const isUserExist = await this.isUserExist(username);
    if (isUserExist) {
      throw new BadRequestException(
        'Username already exists. Please use another username',
      );
    }

    // Check email has exist?
    const isExist = await this.isEmailExist(email);
    if (isExist) {
      throw new BadRequestException(
        `Email ${email} already exists. Please use another email`,
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    const newUser = await this.userModel.create({
      username,
      email,
      password: hashedPassword,
      role: this.configService.get<string>('ROLE_USER'),
      image,
    });

    return { _id: newUser._id };
  }

  async findAll(query: string, curent: number, pageSize: number) {
    const { filter, sort } = aqp(query);
    if (filter.current || filter.current === 0) delete filter.current;
    if (filter.pageSize || filter.pageSize === 0) delete filter.pageSize;

    if (!curent || curent < 1) curent = 1;
    if (!pageSize || pageSize < 1) pageSize = 1;

    const totalItems = (await this.userModel.find(filter).lean()).length;
    const totalPage = Math.ceil(totalItems / pageSize);
    const skip = (curent - 1) * pageSize;

    const results = await this.userModel
      .find(filter)
      .limit(pageSize)
      .skip(skip)
      .select('-password')
      .sort(sort as any);

    return { results, totalPage, totalItems };
  }

  async findOne(_id: string) {
    if (!isValidObjectId(_id)) {
      throw new BadRequestException();
    }

    const result = await this.userModel.findOne({ _id });

    return getInfo({
      object: result,
      fields: ['_id', 'username', 'email', 'role', 'isActive'],
    });
  }

  async update(_id: string, updateUserDto: UpdateUserDto) {
    if (!isValidObjectId(_id)) {
      throw new BadRequestException();
    }

    const { username, email, password, image, role } = updateUserDto;

    // Hash password
    const hashedPassword = await hashPassword(password);

    const filter = { _id };
    const update = { username, email, password: hashedPassword, image, role };
    const options = { new: true };

    const result = await this.userModel.findOneAndUpdate(
      filter,
      update,
      options,
    );

    return getInfo({
      object: result,
      fields: ['_id', 'username', 'email', 'isActive'],
    });
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
