// src/common/base.service.ts
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CollectionReference, DocumentSnapshot, Firestore } from 'firebase-admin/firestore';
import { FIRESTORE_PROVIDER } from 'src/firebase/firebase.module'; // Importamos nuestro proveedor
import { AppStatus } from './app.constants';
import { IBaseModel } from './base.interface';

@Injectable()
export class BaseService<T extends IBaseModel> {
  protected collection: CollectionReference;

  /**
   * El constructor recibe la conexión a Firestore y el nombre de la colección
   * (ej. 'agricultores', 'cultivos', etc.)
   */
  constructor(
    @Inject(FIRESTORE_PROVIDER)
    protected readonly firestore: Firestore,
    private readonly collectionName: string,
  ) {
    this.collection = this.firestore.collection(this.collectionName);
  }

  /**
   * Mapea un documento de Firestore a nuestro modelo (T)
   * La clave es que Firestore guarda el ID por separado de los datos.
   * Esta función los une en un solo objeto.
   */
 
  protected mapDocument(doc: DocumentSnapshot): T {
    // Retorna { id: 'abc...', ...datos }
    return { id: doc.id, ...doc.data() } as T;
  }

  /**
   * CREATE (POST)
   * Crea un nuevo documento en la colección.
   */
  async create(createDto: Omit<T, 'id' | 'estado'>): Promise<T> {
    const itemToCreate = {
      ...createDto,
      estado: AppStatus.activo, // Estado por defecto, igual que en tu app Flutter
    };
    const docRef = await this.collection.add(itemToCreate);
    const newDoc = await docRef.get();
    return this.mapDocument(newDoc);
  }

  /**
   * FIND ALL (GET)
   * Busca todos los documentos que NO estén 'Inactivo' o 'Anulada'.
   */
  async findAllActive(): Promise<T[]> {
    const activeStatuses = [
      AppStatus.activo,
      AppStatus.pendiente,
      AppStatus.completada,
    ];

    const snapshot = await this.collection
      .where('estado', 'in', activeStatuses)
      .get();

    return snapshot.docs.map((doc) => this.mapDocument(doc));
  }

  /**
   * FIND ONE (GET /:id)
   * Busca un documento específico por su ID.
   */
  async findOne(id: string): Promise<T> {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) {
      throw new NotFoundException(
        `Documento con id ${id} no encontrado en ${this.collectionName}`,
      );
    }
    return this.mapDocument(doc);
  }

  /**
   * UPDATE (PUT /:id)
   * Actualiza un documento completo.
   */
  async update(id: string, updateDto: Partial<T>): Promise<T> {
    // Quitamos 'id' y 'estado' si vienen en el body
    delete updateDto.id;
    delete updateDto.estado; // El estado se maneja con updateStatus

    await this.collection.doc(id).update(updateDto);
    return this.findOne(id);
  }

  /**
   * MÉTODO GENÉRICO PARA ACTUALIZAR ESTADO (¡IMPORTANTE!)
   * Actualiza solo el estado de un documento.
   * Usado para 'Inactivo', 'Completado', 'Anulada', etc.
   */
  async updateStatus(id: string, newStatus: string): Promise<void> {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) {
      throw new NotFoundException(
        `Documento con id ${id} no encontrado para actualizar estado`,
      );
    }
    await this.collection.doc(id).update({ estado: newStatus });
  }

  /**
   * DELETE (DELETE /:id)
   * Implementa el borrado lógico estándar (Inactivo).
   * Ahora usa el método genérico updateStatus.
   */
  async deleteLogically(id: string): Promise<void> {
    // Llama al nuevo método genérico con el estado 'Inactivo'
    return this.updateStatus(id, AppStatus.inactivo);
  }
}