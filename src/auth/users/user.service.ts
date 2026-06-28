import { Inject, Injectable } from '@nestjs/common';
import { CollectionReference, DocumentSnapshot, Firestore, Timestamp } from 'firebase-admin/firestore';
import { FIRESTORE_PROVIDER } from 'src/firebase/firebase.module';
import { IUser } from './interfaces/user.interface';

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

  async updateUltimoAcceso(id: string, ultimoAcceso: Timestamp): Promise<void> {
    await this.collection.doc(id).update({ ultimoAcceso });
  }

  private mapDocument(doc: DocumentSnapshot): IUser {
    return { id: doc.id, ...doc.data() } as IUser;
  }
}
