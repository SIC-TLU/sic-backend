import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const HOST = configService.get<string>('HOST');
  const PORT = configService.get<string>('PORT');

  app.setGlobalPrefix('api/v1', { exclude: ['/'] });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(PORT, () => {
    console.log(`App running in ${HOST}:${PORT}`);
  });
}
bootstrap();
