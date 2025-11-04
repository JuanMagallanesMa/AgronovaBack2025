// src/cultivos/cultivos.service.ts
import { Inject, Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/base.service';
import { FIRESTORE_PROVIDER } from 'src/firebase/firebase.module';
import { Cultivo } from './dto/cultivo.dto';
import { Firestore } from 'firebase-admin/firestore';

@Injectable()
export class CultivosService extends BaseService<Cultivo> {
  constructor(
    @Inject(FIRESTORE_PROVIDER)
    protected readonly firestore: Firestore,
  ) {
    super(firestore, 'cultivos');
  }
  // Hereda toda la lógica (create, update, delete, updateStatus)
}