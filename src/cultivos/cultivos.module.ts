// src/cultivos/cultivos.module.ts
import { Module } from '@nestjs/common';
import { CatalogosModule } from 'src/catalogos/catalogos.module';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { CultivosController } from 'src/v1/cultivos/cultivos.controller';
import { CultivosService } from './cultivos.service';

@Module({
  imports: [FirebaseModule, CatalogosModule],
  controllers: [CultivosController],
  providers: [CultivosService],
  exports: [CultivosService],
})
export class CultivosModule {}
