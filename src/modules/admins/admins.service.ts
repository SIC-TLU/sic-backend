import { BadRequestException, Injectable } from '@nestjs/common';
import { Admin } from './schemas/admin.schema';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';
import { InjectModel } from '@nestjs/mongoose';
import { CreateAuthDto } from '@/auth/authUser/dto/create-auth.dto';
import { AdminRepo } from './admins.repo';
import { hashPassword } from '@/helpers';
import { generateCode } from '@/utils';
import { ROLES } from '@/constant';
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

  async handleRegister(registerDto: CreateAuthDto) {
    const { fullName, email, password, confirmPassword, phoneNumber } =
      registerDto;

    if (password !== confirmPassword)
      throw new BadRequestException('Password does not match');

    // Validate password manually inside the service
    if (!this.isValidPassword(password)) {
      throw new BadRequestException(
        'Password must be at least 6 characters long, contain 1 uppercase letter, and 1 special character.',
      );
    }

    // Check email has exist?
    const isEmailExist = await this.adminRepo.isEmailExist(email);
    if (isEmailExist) {
      throw new BadRequestException(
        `Email ${email} already exists. Please use another email!`,
      );
    }

    // Check phone number has exist?
    const isPhoneNumberExist =
      await this.adminRepo.isPhoneNumberExist(phoneNumber);
    if (isPhoneNumberExist) {
      throw new BadRequestException(
        `Phone number ${phoneNumber} already exists. Please use another phone number!`,
      );
    }

    // Generate a unique username
    const baseUsername = this.generateUsername(fullName);
    let username = baseUsername;
    let count = 1;

    while (await this.adminRepo.isAdminExist(username)) {
      username = `${baseUsername}${count}`;
      count++;
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Generate a 4-digit numeric activation code
    const activationCode = generateCode(); // Ensures a 4-digit code

    const user = await this.userModel.create({
      fullName: fullName,
      username: username,
      email,
      phoneNunber: phoneNumber,
      password: hashedPassword,
      isActive: false,
      role: ROLES.superAdmin,
      codeId: activationCode,
      codeExpired: dayjs().add(10, 'minutes'),
    });

    // Send mail
    this.mailerService.sendMail({
      to: user.email, // List to reciver
      subject: 'Active your account at BoBo', // Subject line
      template: 'register',
      context: {
        name: user?.username ?? user?.email,
        activationCode: user.codeId,
      },
    });

    return { _id: user._id, username: user.username };
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
