import { Inject, Injectable } from '@nestjs/common';
import { CollectionReference, DocumentSnapshot, Firestore, Timestamp } from 'firebase-admin/firestore';
import { FIRESTORE_PROVIDER } from 'src/firebase/firebase.module';
import { IUser } from './interfaces/user.interface';

interface CreateUserInput {
  nombre: string;
  correo: string;
  correoNormalizado: string;
  contrasenaHash: string;
  rol: string;
  estado: string;
}

@Injectable()
export class UserService {
  private readonly collection: CollectionReference;

  constructor(
    @Inject(FIRESTORE_PROVIDER)
    private readonly firestore: Firestore,
  ) {
    this.collection = this.firestore.collection('usuarios');
  }

  async findByCorreoNormalizado(correoNormalizado: string): Promise<IUser | null> {
    const snapshot = await this.collection
      .where('correoNormalizado', '==', correoNormalizado)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return null;
    }

    return this.mapDocument(snapshot.docs[0]);
  }

  async findByResetPasswordTokenHash(resetPasswordTokenHash: string): Promise<IUser | null> {
    const snapshot = await this.collection
      .where('resetPasswordTokenHash', '==', resetPasswordTokenHash)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return null;
    }

    return this.mapDocument(snapshot.docs[0]);
  }

  async create(createUserInput: CreateUserInput): Promise<IUser> {
    const docRef = this.collection.doc();
    const usuario = {
      ...createUserInput,
      ultimoAcceso: null,
      resetPasswordTokenHash: null,
      resetPasswordExpiresAt: null,
      resetPasswordRequestedAt: null,
    };

    await docRef.set(usuario);

    return {
      id: docRef.id,
      ...usuario,
    } as IUser;
  }

  async updateUltimoAcceso(id: string, ultimoAcceso: Timestamp): Promise<void> {
    await this.collection.doc(id).update({ ultimoAcceso });
  }

  async setResetPasswordToken(
    id: string,
    resetPasswordTokenHash: string,
    resetPasswordExpiresAt: Timestamp,
    resetPasswordRequestedAt: Timestamp,
  ): Promise<void> {
    await this.collection.doc(id).update({
      resetPasswordTokenHash,
      resetPasswordExpiresAt,
      resetPasswordRequestedAt,
    });
  }

  async updatePasswordAndClearResetToken(id: string, contrasenaHash: string): Promise<void> {
    await this.collection.doc(id).update({
      contrasenaHash,
      resetPasswordTokenHash: null,
      resetPasswordExpiresAt: null,
      resetPasswordRequestedAt: null,
    });
  }

  private mapDocument(doc: DocumentSnapshot): IUser {
    return { id: doc.id, ...doc.data() } as IUser;
  }
}
