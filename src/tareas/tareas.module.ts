// src/tareas/tareas.module.ts
import { Module } from '@nestjs/common';
import { CatalogosModule } from 'src/catalogos/catalogos.module';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { TareasController } from 'src/v1/tareas/tareas.controller';
import { TareasService } from './tareas.service';

@Module({
  imports: [FirebaseModule, CatalogosModule],
  controllers: [TareasController],
  providers: [TareasService],
})
export class TareasModule {}
