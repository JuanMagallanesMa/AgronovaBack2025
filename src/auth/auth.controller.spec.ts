import { AUTH_COOKIE_NAME } from './auth.constants';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;

  beforeEach(() => {
    authService = {
      login: jest.fn(),
      getCurrentUser: jest.fn(),
      register: jest.fn(),
      forgotPassword: jest.fn(),
      resetPassword: jest.fn(),
    } as unknown as jest.Mocked<AuthService>;

    controller = new AuthController(authService);
  });

  it('sets the auth cookie on login', async () => {
    const response = {
      cookie: jest.fn(),
    };
    const loginResponse = {
      accessToken: 'jwt-token',
      user: {
        id: 'u1',
        nombre: 'Ada',
        correo: 'ada@example.com',
        rol: 'Lider',
        estado: 'Activo',
      },
    };
    authService.login.mockResolvedValue(loginResponse);

    await expect(
      controller.login(
        { correo: 'ada@example.com', contrasena: 'secreta123' },
        response as never,
      ),
    ).resolves.toBe(loginResponse);

    expect(response.cookie).toHaveBeenCalledWith(
      AUTH_COOKIE_NAME,
      'jwt-token',
      expect.objectContaining({ httpOnly: true, path: '/' }),
    );
  });

  it('clears the auth cookie on logout', () => {
    const response = {
      clearCookie: jest.fn(),
    };

    expect(controller.logout(response as never)).toEqual({
      message: 'Sesion cerrada correctamente.',
    });
    expect(response.clearCookie).toHaveBeenCalledWith(
      AUTH_COOKIE_NAME,
      expect.objectContaining({ httpOnly: true, path: '/' }),
    );
  });
});
