import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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

  app.enableCors({
    origin: true,
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
    preflightContinue: false,
    credentials: true,
  });

  // 🚀 Swagger Setup
  const config = new DocumentBuilder()
    .setTitle('SIC API')
    .setDescription('API documentation for SIC project')
    .setVersion('1.0')
    .addBearerAuth() // Optional: for JWT auth support
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document); // http://localhost:PORT/api-docs

  await app.listen(PORT, () => {
    console.log(`App running at ${HOST}:${PORT}`);
    console.log(`Swagger Docs available at ${HOST}:${PORT}/api-docs`);
  });
}

bootstrap();
