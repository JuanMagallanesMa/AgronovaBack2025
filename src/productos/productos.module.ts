// src/productos/productos.module.ts
import { Module } from '@nestjs/common';
import { ProductosService } from './productos.service';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { ProductosController } from 'src/v1/productos/productos.controller';

@Module({
  imports: [FirebaseModule],
  controllers: [ProductosController],
  providers: [ProductosService],
})
export class ProductosModule {}