import { BadRequestException, Injectable } from '@nestjs/common';
import { Admin } from './schemas/admin.schema';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';
import { InjectModel } from '@nestjs/mongoose';
import { AdminRepo } from './admins.repo';
import { generateCode } from '@/utils';
import dayjs from 'dayjs';
import { ResendCodeDto } from '@/auth/authAdmin/dto/resend-code.dto';

@Injectable()
export class AdminsService {
  constructor(
    @InjectModel(Admin.name) private userModel: Model<Admin>,
    private configService: ConfigService,
    private readonly mailerService: MailerService,
    private readonly adminRepo: AdminRepo,
  ) {}

  async create(data: Partial<Admin>) {
    return await this.adminRepo.create(data);
  }

  async resendCode(resendCodeDto: ResendCodeDto) {
    const { email } = resendCodeDto;

    const foundUser = await this.userModel.findOne({ email });
    if (!foundUser) throw new BadRequestException();

    foundUser.codeId = generateCode();
    foundUser.codeExpired = dayjs().add(5, 'minutes').toDate();

    await foundUser.save();

    // Send mail
    this.mailerService.sendMail({
      to: foundUser.email, // List to reciver
      subject: 'Resend code to your account at BoBo', // Subject line
      template: 'resend-code',
      context: {
        name: foundUser?.username ?? foundUser?.email,
        activationCode: foundUser.codeId,
      },
    });

    return {};
  }

  private isValidPassword(password: string): boolean {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[\W_]).{6,}$/;
    return passwordRegex.test(password);
  }

  private generateUsername(fullName: string): string {
    return fullName
      .toLowerCase()
      .replace(/\s+/g, '') // Remove spaces
      .replace(/[^a-z0-9]/g, '') // Remove special characters
      .substring(0, 15); // Limit length (optional)
  }
}
