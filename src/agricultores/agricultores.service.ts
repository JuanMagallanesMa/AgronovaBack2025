// src/agricultores/agricultores.service.ts
import { Inject, Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/base.service';
import { FIRESTORE_PROVIDER } from 'src/firebase/firebase.module';
import { Agricultor } from './dto/create-agricultor.dto';
import { Firestore } from 'firebase-admin/firestore';

@Injectable()
export class AgricultoresService extends BaseService<Agricultor> {
  // Le decimos al BaseService:
  // 1. Que necesita la conexión a Firestore
  // 2. Que la colección a usar es 'agricultores'
  constructor(
    @Inject(FIRESTORE_PROVIDER)
    protected readonly firestore: Firestore,
  ) {
    super(firestore, 'agricultores'); // <-- ¡Aquí!
  }

  // ¡Eso es todo!
  // Ya heredamos create(), findAllActive(), findOne(), update() y deleteLogically()
}