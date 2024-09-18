import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const HOST = 'http://localhost';
  const PORT = 8080;
  await app.listen(PORT, () => {
    console.log(`App running in ${HOST}:${PORT}`);
  });
}
bootstrap();
