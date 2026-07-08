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
  Timestamp,
} from 'firebase-admin/firestore';
import { FIRESTORE_PROVIDER } from '../../firebase/firebase.module';
import { IUser } from './interfaces/user.interface';

interface CreateUserInput {
  nombre: string;
  correo: string;
  correoNormalizado: string;
  contrasenaHash: string;
  rol: string;
  estado: string;
}

export interface PublicUser {
  id: string;
  nombre: string;
  correo: string;
  rol: string;
  estado: string;
  ultimoAcceso: string | null;
}

@Injectable()
export class UserService {
  private readonly collection: CollectionReference;
  private static readonly adminManagedRoles = new Set([
    'Administrador',
    'Lider',
  ]);
  private static readonly allowedStatuses = new Set(['Activo', 'Inactivo']);

  constructor(
    @Inject(FIRESTORE_PROVIDER)
    private readonly firestore: Firestore,
  ) {
    this.collection = this.firestore.collection('usuarios');
  }

  async findByCorreoNormalizado(
    correoNormalizado: string,
  ): Promise<IUser | null> {
    const snapshot = await this.collection
      .where('correoNormalizado', '==', correoNormalizado)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return null;
    }

    return this.mapDocument(snapshot.docs[0]);
  }

  async findByResetPasswordTokenHash(
    resetPasswordTokenHash: string,
  ): Promise<IUser | null> {
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

  async updatePasswordAndClearResetToken(
    id: string,
    contrasenaHash: string,
  ): Promise<void> {
    await this.collection.doc(id).update({
      contrasenaHash,
      resetPasswordTokenHash: null,
      resetPasswordExpiresAt: null,
      resetPasswordRequestedAt: null,
    });
  }

  async hasActiveRole(nombre: string): Promise<boolean> {
    const snapshot = await this.firestore
      .collection('rol')
      .where('nombre', '==', nombre)
      .get();

    return snapshot.docs.some((doc) => this.isActiveRole(doc.data()?.estado));
  }

  async findAllPublic(query?: string): Promise<PublicUser[]> {
    const snapshot = await this.collection.get();
    const normalizedQuery = query?.trim().toLowerCase() ?? '';

    return snapshot.docs
      .map((doc) => this.mapDocument(doc))
      .filter((user) => {
        if (!normalizedQuery) {
          return true;
        }

        return (
          user.nombre.toLowerCase().includes(normalizedQuery) ||
          user.correo.toLowerCase().includes(normalizedQuery)
        );
      })
      .sort((left, right) =>
        left.nombre.localeCompare(right.nombre, 'es', { sensitivity: 'base' }),
      )
      .map((user) => this.toPublicUser(user));
  }

  async findPublicById(id: string): Promise<PublicUser> {
    return this.toPublicUser(await this.findById(id));
  }

  async updateRole(id: string, rol: string): Promise<PublicUser> {
    if (!UserService.adminManagedRoles.has(rol)) {
      throw new BadRequestException(
        'Solo se permite asignar los roles Administrador o Lider.',
      );
    }

    if (!(await this.hasActiveRole(rol))) {
      throw new BadRequestException(
        `El rol ${rol} no esta activo en el catalogo.`,
      );
    }

    await this.findById(id);
    await this.collection.doc(id).update({ rol });

    return this.findPublicById(id);
  }

  async updateStatus(id: string, estado: string): Promise<PublicUser> {
    if (!UserService.allowedStatuses.has(estado)) {
      throw new BadRequestException(
        'Solo se permite cambiar el estado a Activo o Inactivo.',
      );
    }

    await this.findById(id);
    await this.collection.doc(id).update({ estado });

    return this.findPublicById(id);
  }

  private mapDocument(doc: DocumentSnapshot): IUser {
    return { id: doc.id, ...doc.data() } as IUser;
  }

  private async findById(id: string): Promise<IUser> {
    const doc = await this.collection.doc(id).get();

    if (!doc.exists) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado.`);
    }

    return this.mapDocument(doc);
  }

  private toPublicUser(user: IUser): PublicUser {
    return {
      id: user.id,
      nombre: user.nombre,
      correo: user.correo,
      rol: user.rol,
      estado: user.estado,
      ultimoAcceso: user.ultimoAcceso
        ? user.ultimoAcceso.toDate().toISOString()
        : null,
    };
  }

  private isActiveRole(estado: unknown): boolean {
    if (typeof estado === 'boolean') {
      return estado;
    }

    return (
      typeof estado === 'string' && estado.trim().toLowerCase() === 'activo'
    );
  }
}
