import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CollectionReference,
  DocumentSnapshot,
  Firestore,
} from 'firebase-admin/firestore';

import { FIRESTORE_PROVIDER } from 'src/firebase/firebase.module';

export const CATALOGO_TIPOS = [
  'categoria-cultivo',
  'tipo-insumo',
  'tipo-tarea',
  'ubicacion',
] as const;

export type CatalogoTipo = (typeof CATALOGO_TIPOS)[number];

type CreateCatalogoData = {
  nombre: string;
  tipo: CatalogoTipo;
  estado?: boolean;
};

type UpdateCatalogoData = {
  nombre?: string;
  estado?: boolean;
};

interface CatalogoDocumento {
  id: string;
  tipo: CatalogoTipo;
  nombre: string;
  estado: boolean;
}

@Injectable()
export class CatalogosService {
  private readonly collection: CollectionReference;

  constructor(
    @Inject(FIRESTORE_PROVIDER)
    private readonly firestore: Firestore,
  ) {
    this.collection = this.firestore.collection('catalogo');
  }

  async obtenerPorTipo(tipo: CatalogoTipo): Promise<CatalogoDocumento[]> {
    this.validarTipo(tipo);

    const snapshot = await this.collection
      .where('tipo', '==', tipo)
      .where('estado', '==', true)
      .get();

    return snapshot.docs.map((doc) => this.mapDocument(doc));
  }

  async crearCatalogo(data: CreateCatalogoData): Promise<CatalogoDocumento> {
    this.validarTipo(data.tipo);
    this.validarEstado(data.estado);

    const docRef = await this.collection.add({
      ...data,
      estado: data.estado ?? true,
    });

    return this.findOne(docRef.id);
  }

  async actualizarCatalogo(
    id: string,
    data: UpdateCatalogoData,
  ): Promise<CatalogoDocumento> {
    this.validarEstado(data.estado);
    await this.findOne(id);
    await this.collection.doc(id).update(data);
    return this.findOne(id);
  }

  async desactivarCatalogo(id: string): Promise<void> {
    await this.findOne(id);
    await this.collection.doc(id).update({ estado: false });
  }

  async validarReferencia(id: string, tipo: CatalogoTipo): Promise<void> {
    const catalogo = await this.findOne(id);

    if (catalogo.tipo !== tipo) {
      throw new BadRequestException(
        `La referencia ${id} no corresponde al tipo de catalogo ${tipo}`,
      );
    }

    if (catalogo.estado !== true) {
      throw new BadRequestException(`La referencia ${id} no esta activa`);
    }
  }

  private async findOne(id: string): Promise<CatalogoDocumento> {
    const doc = await this.collection.doc(id).get();

    if (!doc.exists) {
      throw new NotFoundException(`Catalogo con id ${id} no encontrado`);
    }

    return this.mapDocument(doc);
  }

  private validarTipo(tipo: string): asserts tipo is CatalogoTipo {
    if (!CATALOGO_TIPOS.includes(tipo as CatalogoTipo)) {
      throw new BadRequestException(`Tipo de catalogo invalido: ${tipo}`);
    }
  }

  private validarEstado(estado: boolean | undefined): void {
    if (estado !== undefined && typeof estado !== 'boolean') {
      throw new BadRequestException('El estado del catalogo debe ser boolean');
    }
  }

  private mapDocument(doc: DocumentSnapshot): CatalogoDocumento {
    const data = doc.data();

    if (typeof data?.estado !== 'boolean') {
      throw new BadRequestException(
        `El catalogo ${doc.id} tiene estado invalido; debe ser boolean`,
      );
    }

    return { id: doc.id, ...data } as CatalogoDocumento;
  }
}
