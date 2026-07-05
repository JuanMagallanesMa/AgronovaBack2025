import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { AdminRoleGuard } from 'src/auth/guards/admin-role.guard';
import { UserService } from 'src/auth/users/user.service';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { UsuariosController } from 'src/v1/usuarios/usuarios.controller';

@Module({
  imports: [AuthModule, FirebaseModule],
  controllers: [UsuariosController],
  providers: [AdminRoleGuard, UserService],
})
export class UsuariosModule {}