// src/cultivos/dto/cultivo.dto.ts
import { IsNotEmpty, IsString, IsOptional, IsDateString } from 'class-validator';
import { IBaseModel } from 'src/common/base.interface';

// Interfaz que mapea el modelo de Dart
export interface Cultivo extends IBaseModel {
  nombre: string;
  idCategoria: string;
  idUbicacion: string;
  estado: string;
}

// DTO para POST
export class CreateCultivoDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsNotEmpty()
  @IsString()
  idCategoria: string; // Mapea a CategoriaCultivo

  @IsNotEmpty()
  @IsString()
  idUbicacion: string; // Mapea a Ubicacion

  @IsNotEmpty()
  @IsString()
  estado: string;
}

// DTO para PUT
export class UpdateCultivoDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  idCategoria?: string;

  @IsOptional()
  @IsString()
  idUbicacion?: string;
  
  @IsOptional()
  @IsString()
  estado?: string;
}