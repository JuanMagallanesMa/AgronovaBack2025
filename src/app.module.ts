// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // <-- 1. Importa ConfigModule
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FirebaseModule } from './firebase/firebase.module';

@Module({
  imports: [
    // .forRoot() hace que lea el archivo .env y lo cargue globalmente.
    ConfigModule.forRoot({
      isGlobal: true, // Hace que las variables de .env estén disponibles en toda la app
    }),
    FirebaseModule, // <-- 2. Importa el módulo de Firebase
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}