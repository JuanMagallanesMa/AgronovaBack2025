// src/insumos/insumos.module.ts
import { Module } from '@nestjs/common';
import { CatalogosModule } from 'src/catalogos/catalogos.module';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { InsumosController } from 'src/v1/insumos/insumos.controller';
import { InsumosService } from './insumos.service';

@Module({
  imports: [FirebaseModule, CatalogosModule],
  controllers: [InsumosController],
  providers: [InsumosService],
  exports: [InsumosService],
})
export class InsumosModule {}
