// src/productos/dto/producto.dto.ts
import { IsNotEmpty, IsString, IsOptional, IsNumber, Min } from 'class-validator';
import { IBaseModel } from 'src/common/base.interface';

export interface Producto extends IBaseModel {
  nombre: string;
  descripcion: string;
  cantidadStock: number;
  precioCaja: number;
  estado: string;
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
  precioCaja: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  cantidadStock: number;

  @IsNotEmpty()
  @IsString()
  idCultivo: string; // Mapea a Cultivo

  @IsOptional()
  @IsString()
  estado?: string;
}

export class UpdateProductoDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsOptional()
  @IsString()
  descripcion: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  precioCaja: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  cantidadStock: number;

  @IsNotEmpty()
  @IsString()
  idCultivo: string; // Mapea a Cultivo

  @IsOptional()
  @IsString()
  estado?: string;
}