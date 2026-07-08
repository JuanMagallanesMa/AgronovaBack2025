import { IsIn, IsString } from 'class-validator';

export class UpdateUsuarioEstadoDto {
  @IsString()
  @IsIn(['Activo', 'Inactivo'])
  estado: string;
}
