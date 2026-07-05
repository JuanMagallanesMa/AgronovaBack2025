jest.mock(
  'src/firebase/firebase.module',
  () => ({
    FIRESTORE_PROVIDER: 'FIRESTORE_PROVIDER',
  }),
  { virtual: true },
);

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

import {
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { IUser } from './users/interfaces/user.interface';
import { UserService } from './users/user.service';

describe('AuthService', () => {
  const usuarioBase: IUser = {
    id: 'u1',
    nombre: 'Ada',
    correo: 'ada@example.com',
    correoNormalizado: 'ada@example.com',
    contrasenaHash: 'hash',
    rol: 'Lider',
    estado: 'Activo',
    ultimoAcceso: null,
    resetPasswordTokenHash: null,
    resetPasswordExpiresAt: null,
    resetPasswordRequestedAt: null,
  };

  let authService: AuthService;
  let userService: jest.Mocked<UserService>;
  let bcryptMock: jest.Mocked<typeof bcrypt>;

  beforeEach(() => {
    userService = {
      create: jest.fn(),
      findByCorreoNormalizado: jest.fn(),
      findByResetPasswordTokenHash: jest.fn(),
      hasActiveRole: jest.fn(),
      setResetPasswordToken: jest.fn(),
      updatePasswordAndClearResetToken: jest.fn(),
      updateUltimoAcceso: jest.fn(),
    } as unknown as jest.Mocked<UserService>;

    const configService = {
      get: jest.fn(),
    } as unknown as ConfigService;

    const jwtService = {
      signAsync: jest.fn().mockResolvedValue('jwt-token'),
    } as unknown as JwtService;

    bcryptMock = bcrypt;
    bcryptMock.compare.mockReset();
    bcryptMock.hash.mockReset();

    authService = new AuthService(configService, jwtService, userService);
  });

  it('rechaza el login cuando el rol del usuario no existe activo en la coleccion rol', async () => {
    userService.findByCorreoNormalizado.mockResolvedValue(usuarioBase);
    userService.hasActiveRole.mockResolvedValue(false);
    bcryptMock.compare.mockResolvedValue(true as never);

    await expect(
      authService.login({ correo: usuarioBase.correo, contrasena: 'secreta' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('registra nuevos usuarios con el rol Lider', async () => {
    userService.findByCorreoNormalizado.mockResolvedValue(null);
    userService.hasActiveRole.mockResolvedValue(true);
    userService.create.mockResolvedValue({
      ...usuarioBase,
      id: 'u2',
    });
    bcryptMock.hash.mockResolvedValue('nuevo-hash' as never);

    await authService.register({
      nombre: 'Grace',
      correo: 'grace@example.com',
      contrasena: 'secreta123',
    });

    expect(userService.create).toHaveBeenCalledWith(
      expect.objectContaining({
        rol: 'Lider',
        estado: 'Activo',
      }),
    );
  });

  it('falla el registro si el rol Lider no esta activo en el catalogo', async () => {
    userService.findByCorreoNormalizado.mockResolvedValue(null);
    userService.hasActiveRole.mockResolvedValue(false);
    bcryptMock.hash.mockResolvedValue('nuevo-hash' as never);

    await expect(
      authService.register({
        nombre: 'Grace',
        correo: 'grace@example.com',
        contrasena: 'secreta123',
      }),
    ).rejects.toBeInstanceOf(InternalServerErrorException);
  });
});
