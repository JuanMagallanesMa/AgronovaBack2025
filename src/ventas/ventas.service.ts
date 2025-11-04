// src/ventas/ventas.service.ts
import { Inject, Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/base.service';
import { FIRESTORE_PROVIDER } from 'src/firebase/firebase.module';
import { Venta } from './dto/venta.dto';
import { AppStatus } from 'src/common/app.constants';
import { Firestore } from 'firebase-admin/firestore';

@Injectable()
export class VentasService extends BaseService<Venta> {
  constructor(
    @Inject(FIRESTORE_PROVIDER)
    protected readonly firestore: Firestore,
  ) {
    super(firestore, 'ventas');
  }

  /**
   * Sobrescribimos el método 'create' de BaseService
   * para establecer el estado por defecto a 'Pendiente'.
   */
  async create(createDto: Omit<Venta, 'id' | 'estado'>): Promise<Venta> {
    const itemToCreate = {
      ...createDto,
      estado: AppStatus.pendiente, // Las ventas inician como 'Pendiente'
    };
    const docRef = await this.collection.add(itemToCreate);
    const newDoc = await docRef.get();
    return this.mapDocument(newDoc);
  }

  /**
   * Sobrescribimos el método 'deleteLogically'
   * para usar el estado 'Anulada' en lugar de 'Inactivo'.
   */
  async deleteLogically(id: string): Promise<void> {
    // El VentaProvider de Flutter usa AppStatus.anulada
    await this.updateStatus(id, AppStatus.anulada);
  }
}