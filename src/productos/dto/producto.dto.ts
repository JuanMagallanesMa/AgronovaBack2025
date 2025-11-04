// src/productos/dto/producto.dto.ts
import { IsNotEmpty, IsString, IsOptional, IsNumber, Min } from 'class-validator';
import { IBaseModel } from 'src/common/base.interface';

export interface Producto extends IBaseModel {
  nombre: string;
  descripcion: string;
  precio: number;
  unidad: string;
  idCultivo: string;
}

export class CreateProductoDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsOptional()
  @IsString()
  descripcion: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  precio: number;

  @IsNotEmpty()
  @IsString()
  unidad: string; // Ej. 'kg', 'saco', 'unidad'

  @IsNotEmpty()
  @IsString()
  idCultivo: string; // Mapea a Cultivo
}

export class UpdateProductoDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  precio?: number;

  @IsOptional()
  @IsString()
  unidad?: string;

  @IsOptional()
  @IsString()
  idCultivo?: string;
}