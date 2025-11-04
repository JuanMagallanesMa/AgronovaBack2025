// src/cultivos/dto/cultivo.dto.ts
import { IsNotEmpty, IsString, IsOptional, IsDateString } from 'class-validator';
import { IBaseModel } from 'src/common/base.interface';

// Interfaz que mapea el modelo de Dart
export interface Cultivo extends IBaseModel {
  nombre: string;
  fechaSiembra: string;
  fechaCosecha: string;
  idCategoria: string;
  idUbicacion: string;
}

// DTO para POST
export class CreateCultivoDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsNotEmpty()
  @IsDateString()
  fechaSiembra: string;

  @IsNotEmpty()
  @IsDateString()
  fechaCosecha: string;

  @IsNotEmpty()
  @IsString()
  idCategoria: string; // Mapea a CategoriaCultivo

  @IsNotEmpty()
  @IsString()
  idUbicacion: string; // Mapea a Ubicacion
}

// DTO para PUT
export class UpdateCultivoDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsDateString()
  fechaSiembra?: string;

  @IsOptional()
  @IsDateString()
  fechaCosecha?: string;

  @IsOptional()
  @IsString()
  idCategoria?: string;

  @IsOptional()
  @IsString()
  idUbicacion?: string;
}