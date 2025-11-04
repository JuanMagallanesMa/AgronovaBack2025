// src/cultivos/cultivos.module.ts
import { Module } from '@nestjs/common';
import { CultivosService } from './cultivos.service';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { CultivosController } from 'src/v1/cultivos/cultivos.controller';

@Module({
  imports: [FirebaseModule],
  controllers: [CultivosController],
  providers: [CultivosService],
})
export class CultivosModule {}