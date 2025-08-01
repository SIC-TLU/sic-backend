import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { hashPassword } from './helpers';
import { ROLES, STATUS_USER } from './constant';
import { AdminRepo } from './modules/admins/admins.repo';
import { AdminsService } from './modules/admins/admins.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const configService = app.get(ConfigService);
  const adminService = app.get(AdminsService);
  const usersRepo = app.get(AdminRepo);

  const adminEmail = configService.get<string>('ADMIN_EMAIL')!;
  const adminUsername = configService.get<string>('ADMIN_USERNAME')!;
  const adminPhone = configService.get<string>('ADMIN_PHONE')!;
  const adminPassword = configService.get<string>('ADMIN_PASSWORD')!;

  const existingAdmin = await usersRepo.findByEmail({ email: adminEmail });

  if (existingAdmin) {
    console.log(`Admin user with email ${adminEmail} already exists.`);
    await app.close();
    return;
  }

  const hashedPassword = await hashPassword(adminPassword);

  await adminService.create({
    fullName: 'Admin',
    username: adminUsername,
    email: adminEmail,
    phoneNumber: adminPhone,
    password: hashedPassword,
    codeId: '',
    isActive: true,
    role: ROLES.SUPER_ADMIN,
    status: STATUS_USER.ACTIVE,
  });

  console.log('✅ Create admin successfully!');
  await app.close();
}

void bootstrap();
