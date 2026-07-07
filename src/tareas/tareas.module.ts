// src/tareas/tareas.module.ts
import { Module } from '@nestjs/common';
import { AgricultoresModule } from 'src/agricultores/agricultores.module';
import { CatalogosModule } from 'src/catalogos/catalogos.module';
import { CultivosModule } from 'src/cultivos/cultivos.module';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { InsumosModule } from 'src/insumos/insumos.module';
import { TareasController } from 'src/v1/tareas/tareas.controller';
import { TareasService } from './tareas.service';

@Module({
  imports: [
    FirebaseModule,
    CatalogosModule,
    CultivosModule,
    AgricultoresModule,
    InsumosModule,
  ],
  controllers: [TareasController],
  providers: [TareasService],
})
export class TareasModule {}