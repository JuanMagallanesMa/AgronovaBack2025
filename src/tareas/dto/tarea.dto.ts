// src/tareas/dto/tarea.dto.ts
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsDateString,
  IsArray,
  IsNumber, // 1. Importar validador de número
  IsPositive, // 2. Importar validador de positivo
  ValidateNested, // 3. Importar validador anidado
} from 'class-validator';
import { Type } from 'class-transformer'; // 4. Importar Type para la transformación
import { IBaseModel } from 'src/common/base.interface';

// --- NUEVO DTO ---
// 5. Definir la estructura del insumo asignado
export class InsumoAsignadoDto {
  @IsNotEmpty()
  @IsString()
  idInsumo: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  cantidad: number;
}
// --- FIN NUEVO DTO ---

// 6. Actualizar la interfaz (opcional pero recomendado)
export interface Tarea extends IBaseModel {
  nombre: string;
  fechaInicio: string;
  fechaFin: string;
  idCultivo: string;
  idTipoTarea: string;
  idAgricultores: string[];
  // 7. Actualizar la interfaz para reflejar la nueva estructura
  insumosAsignados: InsumoAsignadoDto[]; 
  descripcion: string;
  estado: string;
}

export class CreateTareaDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsNotEmpty()
  @IsDateString()
  fechaInicio: string;

  @IsNotEmpty()
  @IsDateString()
  fechaFin: string;

  @IsNotEmpty()
  @IsString()
  idCultivo: string;

  @IsNotEmpty()
  @IsString()
  idTipoTarea: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  idAgricultores: string[];

  // 8. Reemplazar idInsumos por insumosAsignados
  @IsArray()
  @ValidateNested({ each: true }) // 9. Validar cada objeto del array
  @Type(() => InsumoAsignadoDto) // 10. Indicar a class-transformer qué clase usar
  @IsOptional()
  insumosAsignados: InsumoAsignadoDto[]; // Ya no es idInsumos: string[]

  @IsNotEmpty()
  @IsString()
  descripcion: string;

  @IsOptional()
  @IsString()
  estado: string;
}

export class UpdateTareaDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsDateString()
  fechaInicio?: string;

  @IsOptional()
  @IsDateString()
  fechaFin?: string;

  @IsOptional()
  @IsString()
  idCultivo?: string;

  @IsOptional()
  @IsString()
  idTipoTarea?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  idAgricultores?: string[];

  // 11. Replicar el cambio en UpdateTareaDto
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => InsumoAsignadoDto)
  @IsOptional()
  insumosAsignados?: InsumoAsignadoDto[];

  // --- CORRECCIÓN IMPORTANTE ---
  // 12. En tu UpdateTareaDto, 'descripcion' no debería ser @IsNotEmpty()
  // Si es @IsNotEmpty(), te obligará a enviarla siempre.
  // Debe ser @IsOptional() como los demás.
  @IsOptional() 
  @IsString()
  descripcion?: string; // Cambiado de @IsNotEmpty() a @IsOptional()

  @IsOptional()
  @IsString()
  estado?: string;
}