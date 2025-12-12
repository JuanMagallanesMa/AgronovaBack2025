// src/ventas/ventas.module.ts
import { Module } from '@nestjs/common';
import { VentasService } from './ventas.service';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { VentasController } from 'src/v1/ventas/ventas.controller';

@Module({
  imports: [FirebaseModule],
  controllers: [VentasController],
  providers: [VentasService],
  exports: [VentasService],
})
export class VentasModule {}