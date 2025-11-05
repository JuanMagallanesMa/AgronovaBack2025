// src/tareas/dto/tarea.dto.ts
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsDateString,
  IsArray,
} from 'class-validator';
import { IBaseModel } from 'src/common/base.interface';

export interface Tarea extends IBaseModel {
  nombre: string;
  fechaInicio: string;
  fechaFin: string;
  idCultivo: string;
  idTipoTarea: string;
  idAgricultores: string[];
  idInsumos: string[];
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
  idAgricultores: string[]; // Mapea a List<String>

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  idInsumos: string[]; // Mapea a List<String>

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

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  idInsumos?: string[];

  @IsNotEmpty()
  @IsString()
  descripcion: string;

  @IsOptional()
  @IsString()
  estado: string;
}