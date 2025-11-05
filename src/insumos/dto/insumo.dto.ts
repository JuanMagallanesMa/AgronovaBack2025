// src/insumos/dto/insumo.dto.ts
import { IsNotEmpty, IsString, IsOptional, IsNumber, Min } from 'class-validator';
import { IBaseModel } from 'src/common/base.interface';

export interface Insumo extends IBaseModel {
  idTipoInsumo: string;
  descripcion: string;
  cantidad: number;
  unidadMedida: string
  estado: string;
}

export class CreateInsumoDto {
  @IsNotEmpty()
  @IsString()
  descripcion: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  cantidad: number;

  @IsNotEmpty()
  @IsString()
  unidadMedida: string; // Ej. 'kg', 'litros', 'unidades'

  @IsNotEmpty()
  @IsString()
  idTipoInsumo: string; // Mapea a TipoInsumo

  @IsOptional()
  @IsString()
  estado?: string; 
}

export class UpdateInsumoDto {
  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  cantidad?: number;

  @IsOptional()
  @IsString()
  unidadMedida?: string;

  @IsOptional()
  @IsString()
  idTipoInsumo?: string;

  @IsOptional()
  @IsString()
  estado?: string; 

}