import { ForbiddenException } from '@nestjs/common';
import { UserService } from 'src/auth/users/user.service';
import { UsuariosController } from './usuarios.controller';

describe('UsuariosController', () => {
  const usuarioPublico = {
    id: 'admin-1',
    nombre: 'Admin Uno',
    correo: 'admin@agronova.test',
    rol: 'Administrador',
    estado: 'Activo',
    ultimoAcceso: '2026-07-04T15:00:00.000Z',
  };

  let controller: UsuariosController;
  let userService: jest.Mocked<UserService>;

  beforeEach(() => {
    userService = {
      findAllPublic: jest.fn(),
      findPublicById: jest.fn(),
      updateRole: jest.fn(),
      updateStatus: jest.fn(),
    } as unknown as jest.Mocked<UserService>;

    controller = new UsuariosController(userService);
  });

  it('lista usuarios publicos filtrando por q', async () => {
    userService.findAllPublic.mockResolvedValue([usuarioPublico]);

    await expect(controller.findAll('admin')).resolves.toEqual([usuarioPublico]);
    expect(userService.findAllPublic).toHaveBeenCalledWith('admin');
  });

  it('bloquea la auto-democion del administrador', () => {
    expect(() =>
      controller.updateRole(
        'admin-1',
        { rol: 'Lider' },
        { user: { sub: 'admin-1', correo: usuarioPublico.correo, rol: 'Administrador' } },
      ),
    ).toThrow(ForbiddenException);
  });

  it('bloquea la auto-desactivacion del administrador', () => {
    expect(() =>
      controller.updateStatus(
        'admin-1',
        { estado: 'Inactivo' },
        { user: { sub: 'admin-1', correo: usuarioPublico.correo, rol: 'Administrador' } },
      ),
    ).toThrow(ForbiddenException);
  });
});