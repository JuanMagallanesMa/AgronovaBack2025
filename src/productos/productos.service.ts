// src/productos/productos.service.ts
import { Inject, Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/base.service';
import { FIRESTORE_PROVIDER } from 'src/firebase/firebase.module';
import { Producto } from './dto/producto.dto';
import { Firestore } from 'firebase-admin/firestore';

@Injectable()
export class ProductosService extends BaseService<Producto> {
  constructor(
    @Inject(FIRESTORE_PROVIDER)
    protected readonly firestore: Firestore,
  ) {
    super(firestore, 'productos');
  }
}