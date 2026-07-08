// src/catalogos/catalogos.module.ts
import { Module } from '@nestjs/common';

import { AdminRoleGuard } from 'src/auth/guards/admin-role.guard';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { CatalogosController } from 'src/v1/catalogos/catalogos.controller';
import { CatalogosService } from './catalogos.service';
import { CategoriasCultivoService } from './services/categorias-cultivo/categorias-cultivo.service';
import { TiposInsumoService } from './services/tipos-insumo/tipos-insumo.service';
import { TiposTareaService } from './services/tipos-tarea/tipos-tarea.service';
import { UbicacionesService } from './services/ubicaciones/ubicaciones.service';

@Module({
  imports: [FirebaseModule],
  controllers: [CatalogosController],
  providers: [
    AdminRoleGuard,
    CatalogosService,
    CategoriasCultivoService,
    UbicacionesService,
    TiposInsumoService,
    TiposTareaService,
  ],
  exports: [CatalogosService],
})
export class CatalogosModule {}
