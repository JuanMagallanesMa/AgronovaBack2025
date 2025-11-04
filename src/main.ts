// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'; // <-- 1. Importa

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // <-- 2. Añade esta línea para habilitar la validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Ignora campos que no estén en el DTO
      forbidNonWhitelisted: true, // Lanza error si hay campos no permitidos
    }),
  );

  await app.listen(3000);
}
bootstrap();