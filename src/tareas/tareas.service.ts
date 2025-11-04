// src/tareas/tareas.service.ts
import { Inject, Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/base.service';
import { FIRESTORE_PROVIDER } from 'src/firebase/firebase.module';
import { Tarea } from './dto/tarea.dto';
import { Firestore } from 'firebase-admin/firestore';

@Injectable()
export class TareasService extends BaseService<Tarea> {
  constructor(
    @Inject(FIRESTORE_PROVIDER)
    protected readonly firestore: Firestore,
  ) {
    super(firestore, 'tareas');
  }
}