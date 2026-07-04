// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { FirebaseModule } from './firebase/firebase.module';
import { AgricultoresModule } from './agricultores/agricultores.module';
import { CatalogosModule } from './catalogos/catalogos.module';
import { CultivosModule } from './cultivos/cultivos.module';
import { InsumosModule } from './insumos/insumos.module';
import { TareasModule } from './tareas/tareas.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    FirebaseModule,
    // --- Tus Modulos de API ---
    AgricultoresModule,
    CatalogosModule,
    CultivosModule,
    InsumosModule,
    TareasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
