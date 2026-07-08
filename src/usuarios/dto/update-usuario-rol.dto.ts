import { IsIn, IsString } from 'class-validator';

export class UpdateUsuarioRolDto {
  @IsString()
  @IsIn(['Administrador', 'Lider'])
  rol: string;
}
