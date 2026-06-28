import { Timestamp } from 'firebase-admin/firestore';

export interface IUser {
  id: string;
  nombre: string;
  correo: string;
  correoNormalizado: string;
  contrasenaHash: string;
  rol: string;
  estado: string;
  ultimoAcceso?: Timestamp | null;
  resetPasswordTokenHash?: string | null;
  resetPasswordExpiresAt?: Timestamp | null;
  resetPasswordRequestedAt?: Timestamp | null;
}
