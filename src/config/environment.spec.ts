import { getCorsOrigins, validateEnvironment } from './environment';

describe('environment', () => {
  it('falla si falta JWT_SECRET', () => {
    expect(() =>
      validateEnvironment({
        FIREBASE_SERVICE_ACCOUNT_PATH: 'firebase.json',
      }),
    ).toThrow('JWT_SECRET');
  });

  it('falla si la recuperacion queda configurada a medias', () => {
    expect(() =>
      validateEnvironment({
        JWT_SECRET: 'secret',
        FIREBASE_SERVICE_ACCOUNT_PATH: 'firebase.json',
        FRONTEND_URL: 'http://localhost:4200',
      }),
    ).toThrow('RESEND_API_KEY');
  });

  it('separa y limpia CORS_ORIGINS', () => {
    expect(
      getCorsOrigins({
        CORS_ORIGINS: 'http://localhost:4200, http://127.0.0.1:4200 ',
      }),
    ).toEqual(['http://localhost:4200', 'http://127.0.0.1:4200']);
  });
});
