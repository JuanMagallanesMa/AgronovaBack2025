// src/insumos/insumos.module.ts
import { Module } from '@nestjs/common';
import { InsumosService } from './insumos.service';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { InsumosController } from 'src/v1/insumos/insumos.controller';

@Module({
  imports: [FirebaseModule],
  controllers: [InsumosController],
  providers: [InsumosService],
  exports: [InsumosService],
})
export class InsumosModule {}