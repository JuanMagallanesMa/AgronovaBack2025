// src/catalogos/dto/catalogo.dto.ts
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

// DTO para crear cualquier catálogo simple (Categoria, Ubicacion, etc.)
export class CreateCatalogoDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;
}

// DTO para actualizar
export class UpdateCatalogoDto {
  @IsOptional()
  @IsString()
  nombre?: string;
}