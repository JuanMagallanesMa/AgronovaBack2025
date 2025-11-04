// src/insumos/dto/insumo.dto.ts
import { IsNotEmpty, IsString, IsOptional, IsNumber, Min } from 'class-validator';
import { IBaseModel } from 'src/common/base.interface';

export interface Insumo extends IBaseModel {
  nombre: string;
  cantidad: number;
  unidad: string;
  idTipoInsumo: string;
}

export class CreateInsumoDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  cantidad: number;

  @IsNotEmpty()
  @IsString()
  unidad: string; // Ej. 'kg', 'litros', 'unidades'

  @IsNotEmpty()
  @IsString()
  idTipoInsumo: string; // Mapea a TipoInsumo
}

export class UpdateInsumoDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  cantidad?: number;

  @IsOptional()
  @IsString()
  unidad?: string;

  @IsOptional()
  @IsString()
  idTipoInsumo?: string;
}