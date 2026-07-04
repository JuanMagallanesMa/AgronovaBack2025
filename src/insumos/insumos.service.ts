import { Inject, Injectable } from '@nestjs/common';
import { Firestore } from 'firebase-admin/firestore';

import { CatalogosService } from 'src/catalogos/catalogos.service';
import { BaseService } from 'src/common/base.service';
import { FIRESTORE_PROVIDER } from 'src/firebase/firebase.module';
import { CreateInsumoDto, Insumo, UpdateInsumoDto } from './dto/insumo.dto';

@Injectable()
export class InsumosService extends BaseService<Insumo> {
  constructor(
    @Inject(FIRESTORE_PROVIDER)
    protected readonly firestore: Firestore,
    private readonly catalogosService: CatalogosService,
  ) {
    super(firestore, 'insumos');
  }

  override async create(createDto: CreateInsumoDto): Promise<Insumo> {
    await this.catalogosService.validarReferencia(createDto.idTipoInsumo, 'tipo-insumo');
    return super.create(createDto);
  }

  override async update(id: string, updateDto: UpdateInsumoDto): Promise<Insumo> {
    if (updateDto.idTipoInsumo) {
      await this.catalogosService.validarReferencia(updateDto.idTipoInsumo, 'tipo-insumo');
    }

    return super.update(id, updateDto);
  }
}
