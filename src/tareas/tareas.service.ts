import { Inject, Injectable } from '@nestjs/common';
import { Firestore } from 'firebase-admin/firestore';

import { CatalogosService } from 'src/catalogos/catalogos.service';
import { BaseService } from 'src/common/base.service';
import { FIRESTORE_PROVIDER } from 'src/firebase/firebase.module';
import { CreateTareaDto, Tarea, UpdateTareaDto } from './dto/tarea.dto';

@Injectable()
export class TareasService extends BaseService<Tarea> {
  constructor(
    @Inject(FIRESTORE_PROVIDER)
    protected readonly firestore: Firestore,
    private readonly catalogosService: CatalogosService,
  ) {
    super(firestore, 'tareas');
  }

  override async create(createDto: CreateTareaDto): Promise<Tarea> {
    await this.catalogosService.validarReferencia(
      createDto.idTipoTarea,
      'tipo-tarea',
    );
    return super.create(createDto);
  }

  override async update(id: string, updateDto: UpdateTareaDto): Promise<Tarea> {
    if (updateDto.idTipoTarea) {
      await this.catalogosService.validarReferencia(
        updateDto.idTipoTarea,
        'tipo-tarea',
      );
    }

    return super.update(id, updateDto);
  }
}
