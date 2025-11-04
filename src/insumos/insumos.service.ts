// src/insumos/insumos.service.ts
import { Inject, Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/base.service';
import { FIRESTORE_PROVIDER } from 'src/firebase/firebase.module';
import { Insumo } from './dto/insumo.dto';
import { Firestore } from 'firebase-admin/firestore';

@Injectable()
export class InsumosService extends BaseService<Insumo> {
  constructor(
    @Inject(FIRESTORE_PROVIDER)
    protected readonly firestore: Firestore,
  ) {
    super(firestore, 'insumos');
  }
}