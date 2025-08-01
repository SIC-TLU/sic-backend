import { BadRequestException, Injectable } from '@nestjs/common';
import { Admin } from './schemas/admin.schema';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';
import { InjectModel } from '@nestjs/mongoose';
import { getInfo, isValidObjectId } from '@/utils';

@Injectable()
export class AdminRepo {
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<Admin>,
    private configService: ConfigService,
    private readonly mailerService: MailerService,
  ) {}

  async findByEmail({ email }: { email: string }) {
    return await this.adminModel.findOne({ email });
  }

  async findOneById(_id: string) {
    if (!isValidObjectId(_id)) {
      throw new BadRequestException();
    }

    const result = await this.adminModel.findById(_id);

    return getInfo({
      object: result,
      fields: ['_id', 'fullName', 'username', 'email', 'role', 'isActive'],
    });
  }

  async findOneByUsername(username: string) {
    return await this.adminModel.findOne({ username });
  }

  async isEmailExist(email: string) {
    const hasEmail = await this.adminModel.exists({ email });
    if (hasEmail) return true;

    return false;
  }

  async isPhoneNumberExist(phoneNumber: string): Promise<boolean> {
    return !!(await this.adminModel.findOne({ phoneNumber }));
  }

  async isAdminExist(username: string) {
    const hasUser = await this.adminModel.exists({ username });
    if (hasUser) return true;

    return false;
  }

  async create(data: Partial<Admin>) {
    return this.adminModel.create(data);
  }
}
