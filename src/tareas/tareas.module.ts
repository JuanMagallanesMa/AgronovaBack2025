// src/tareas/tareas.module.ts
import { Module } from '@nestjs/common';
import { TareasService } from './tareas.service';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { TareasController } from 'src/v1/tareas/tareas.controller';

@Module({
  imports: [FirebaseModule],
  controllers: [TareasController],
  providers: [TareasService],
  exports: [TareasService],
})
export class TareasModule {}