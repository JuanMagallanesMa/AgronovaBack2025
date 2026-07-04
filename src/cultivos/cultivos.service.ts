import { Inject, Injectable } from '@nestjs/common';
import { Firestore } from 'firebase-admin/firestore';

import { CatalogosService } from 'src/catalogos/catalogos.service';
import { BaseService } from 'src/common/base.service';
import { FIRESTORE_PROVIDER } from 'src/firebase/firebase.module';
import { Cultivo, CreateCultivoDto, UpdateCultivoDto } from './dto/cultivo.dto';

@Injectable()
export class CultivosService extends BaseService<Cultivo> {
  constructor(
    @Inject(FIRESTORE_PROVIDER)
    protected readonly firestore: Firestore,
    private readonly catalogosService: CatalogosService,
  ) {
    super(firestore, 'cultivos');
  }

  override async create(createDto: CreateCultivoDto): Promise<Cultivo> {
    await this.validarReferencias(createDto.idCategoria, createDto.idUbicacion);
    return super.create(createDto);
  }

  override async update(id: string, updateDto: UpdateCultivoDto): Promise<Cultivo> {
    if (updateDto.idCategoria) {
      await this.catalogosService.validarReferencia(updateDto.idCategoria, 'categoria-cultivo');
    }

    if (updateDto.idUbicacion) {
      await this.catalogosService.validarReferencia(updateDto.idUbicacion, 'ubicacion');
    }

    return super.update(id, updateDto);
  }

  private async validarReferencias(idCategoria: string, idUbicacion: string): Promise<void> {
    await this.catalogosService.validarReferencia(idCategoria, 'categoria-cultivo');
    await this.catalogosService.validarReferencia(idUbicacion, 'ubicacion');
  }
}
