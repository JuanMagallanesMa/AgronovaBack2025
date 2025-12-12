// src/catalogos/catalogos.module.ts
import { Module } from '@nestjs/common';

import { FirebaseModule } from 'src/firebase/firebase.module';
import { CatalogosController } from 'src/v1/catalogos/catalogos.controller';
import { CategoriasCultivoService } from './services/categorias-cultivo/categorias-cultivo.service';
import { TiposInsumoService } from './services/tipos-insumo/tipos-insumo.service';
import { TiposTareaService } from './services/tipos-tarea/tipos-tarea.service';
import { UbicacionesService } from './services/ubicaciones/ubicaciones.service';

@Module({
  imports: [FirebaseModule], // Importante para que los services puedan inyectar FIRESTORE_PROVIDER
  controllers: [CatalogosController],
  providers: [
    CategoriasCultivoService,
    UbicacionesService,
    TiposInsumoService,
    TiposTareaService,
  ],
  exports: [
    CategoriasCultivoService,
    UbicacionesService,
    TiposInsumoService,
    TiposTareaService,
  ],
  
})
export class CatalogosModule {}