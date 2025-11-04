// src/catalogos/services/ubicaciones.service.ts
import { Inject, Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/base.service';
import { ReferenciaBase } from 'src/common/base.interface';
import { FIRESTORE_PROVIDER } from 'src/firebase/firebase.module';
import { Firestore } from 'firebase-admin/firestore';

@Injectable()
export class UbicacionesService extends BaseService<ReferenciaBase> {
  constructor(
    @Inject(FIRESTORE_PROVIDER)
    protected readonly firestore: Firestore,
  ) {
    super(firestore, 'ubicaciones');
  }
}