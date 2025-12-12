import { Module } from '@nestjs/common';
import { IaService } from './ia.service';
import { IaController } from './ia.controller';
import { ConfigModule } from '@nestjs/config';

// Importamos TODOS los módulos funcionales
import { TareasModule } from '../tareas/tareas.module';
import { CultivosModule } from '../cultivos/cultivos.module';
import { VentasModule } from '../ventas/ventas.module';
import { ProductosModule } from '../productos/productos.module';
import { InsumosModule } from '../insumos/insumos.module';
import { CatalogosModule } from '../catalogos/catalogos.module'; // Para tipos de tarea/insumo

@Module({
  imports: [
    ConfigModule,
    TareasModule,
    CultivosModule,
    VentasModule,
    ProductosModule,
    InsumosModule,
    CatalogosModule,
  ],
  controllers: [IaController],
  providers: [IaService],
})
export class IaModule {}