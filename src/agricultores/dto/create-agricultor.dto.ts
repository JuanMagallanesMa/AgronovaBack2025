// src/agricultores/dto/create-agricultor.dto.ts
import { IsNotEmpty, IsString, IsOptional, IsNumber, Min } from 'class-validator';
import { IBaseModel } from 'src/common/base.interface';

// 1. Esta es la interfaz que usará nuestro servicio
// Mapea 1-a-1 con tu clase Agricultor en Dart
export class Agricultor implements IBaseModel {
  id: string;
  estado: string;

  nombre: string;
  edad: number;
  zona: string;
  experiencia: string;
}

// 2. Este es el DTO que valida el JSON que llega por POST
export class CreateAgricultorDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  edad: number;

  @IsNotEmpty()
  @IsString()
  zona: string;

  @IsNotEmpty()
  @IsString()
  experiencia: string;

  @IsOptional()
  @IsString()
  estado?: string;
}

// 3. Este es el DTO para el PUT (actualizar)
export class UpdateAgricultorDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  edad?: number;

  @IsOptional()
  @IsString()
  zona?: string;

  @IsOptional()
  @IsString()
  experiencia?: string;

  @IsOptional()
  @IsString()
  estado?: string;
}