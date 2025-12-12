// src/agricultores/agricultores.module.ts
import { Module } from '@nestjs/common';
import { AgricultoresService } from './agricultores.service';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { AgricultoresController } from 'src/v1/agricultores/agricultores.controller';

@Module({
  imports: [FirebaseModule],
  controllers: [AgricultoresController],
  providers: [AgricultoresService],
  exports: [AgricultoresService],
})
export class AgricultoresModule {}