import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { AuthJwtPayload } from '../auth.service';

@Injectable()
export class AdminRoleGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{ user?: AuthJwtPayload }>();

    if (request.user?.rol === 'Administrador') {
      return true;
    }

    throw new ForbiddenException('No tienes permisos para acceder a Parametros/Catalogos.');
  }
}
