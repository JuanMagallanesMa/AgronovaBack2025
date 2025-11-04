// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FirebaseModule } from './firebase/firebase.module';
import { AgricultoresModule } from './agricultores/agricultores.module';
import { CatalogosModule } from './catalogos/catalogos.module';
import { CultivosModule } from './cultivos/cultivos.module';
import { InsumosModule } from './insumos/insumos.module';
import { ProductosModule } from './productos/productos.module';
import { TareasModule } from './tareas/tareas.module';
import { VentasModule } from './ventas/ventas.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    FirebaseModule,
    
    // --- Tus Módulos de API ---
    AgricultoresModule,
    CatalogosModule,
    CultivosModule,
    InsumosModule,
    ProductosModule,
    TareasModule,
    VentasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}