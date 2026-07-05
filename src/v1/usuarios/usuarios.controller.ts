import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthJwtPayload } from '../../auth/auth.service';
import { AdminRoleGuard } from '../../auth/guards/admin-role.guard';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PublicUser, UserService } from '../../auth/users/user.service';
import { UpdateUsuarioEstadoDto } from '../../usuarios/dto/update-usuario-estado.dto';
import { UpdateUsuarioRolDto } from '../../usuarios/dto/update-usuario-rol.dto';

@UseGuards(JwtAuthGuard, AdminRoleGuard)
@Controller('v1/usuarios')
export class UsuariosController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll(@Query('q') q?: string): Promise<PublicUser[]> {
    return this.userService.findAllPublic(q);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<PublicUser> {
    return this.userService.findPublicById(id);
  }

  @Patch(':id/rol')
  updateRole(
    @Param('id') id: string,
    @Body() updateUsuarioRolDto: UpdateUsuarioRolDto,
    @Req() request: { user?: AuthJwtPayload },
  ): Promise<PublicUser> {
    if (request.user?.sub === id && updateUsuarioRolDto.rol === 'Lider') {
      throw new ForbiddenException('No puedes cambiar tu propio rol de Administrador a Lider.');
    }

    return this.userService.updateRole(id, updateUsuarioRolDto.rol);
  }

  @Patch(':id/estado')
  updateStatus(
    @Param('id') id: string,
    @Body() updateUsuarioEstadoDto: UpdateUsuarioEstadoDto,
    @Req() request: { user?: AuthJwtPayload },
  ): Promise<PublicUser> {
    if (request.user?.sub === id && updateUsuarioEstadoDto.estado === 'Inactivo') {
      throw new ForbiddenException('No puedes desactivar tu propio usuario.');
    }

    return this.userService.updateStatus(id, updateUsuarioEstadoDto.estado);
  }
}
