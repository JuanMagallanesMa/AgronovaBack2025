// src/firebase/firebase.module.ts
import { Module, Global } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

// Esta constante la usaremos para 'inyectar' Firestore en otros servicios
export const FIRESTORE_PROVIDER = 'FIRESTORE_PROVIDER';

@Global() // <-- Hace que este módulo sea visible en toda la app
@Module({
  imports: [ConfigModule], // Importamos ConfigModule para poder usar ConfigService
  providers: [
    {
      // --- Provider que INICIALIZA Firebase Admin ---
      provide: 'FIREBASE_APP',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        // Lee la ruta del archivo .json desde el .env
        const serviceAccountPath = configService.get<string>(
          'FIREBASE_SERVICE_ACCOUNT_PATH',
        );

        // Si ya está inicializada, no lo hagas de nuevo
        if (admin.apps.length) {
          return admin.app();
        }

        // Configuración de la credencial
        const serviceAccount = require(`../../${serviceAccountPath}`); // (la ruta es desde /dist)

        // Inicializa la app de Firebase
        return admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
        });
      },
    },
    {
      // --- Provider que EXPONE la base de datos (Firestore) ---
      provide: FIRESTORE_PROVIDER, // Este es el 'nombre' que usaremos para inyectarlo
      inject: ['FIREBASE_APP'], // Depende de que la app esté inicializada
      useFactory: (app: admin.app.App) => {
        return app.firestore(); // <-- Devuelve la instancia de Firestore
      },
    },
  ],
  // Exportamos los 'providers' para que otros módulos puedan usarlos
  exports: ['FIREBASE_APP', FIRESTORE_PROVIDER],
})
export class FirebaseModule {}