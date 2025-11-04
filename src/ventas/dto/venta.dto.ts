// src/ventas/dto/venta.dto.ts
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsDateString,
  IsArray,
  ValidateNested,
  IsNumber,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { IBaseModel } from 'src/common/base.interface';

// DTO para el objeto anidado VentaDetalle
export class VentaDetalleDto {
  @IsNotEmpty()
  @IsString()
  idProducto: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  cantidad: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  precioUnitario: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  subtotal: number;
}

export interface Venta extends IBaseModel {
  fecha: string;
  cliente: string;
  total: number;
  detalles: VentaDetalleDto[];
}

export class CreateVentaDto {
  @IsNotEmpty()
  @IsDateString()
  fecha: string;

  @IsNotEmpty()
  @IsString()
  cliente: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  total: number;

  @IsArray()
  @ValidateNested({ each: true }) // Valida cada objeto en el array
  @Type(() => VentaDetalleDto) // Le dice a class-transformer qué clase usar
  @IsNotEmpty()
  detalles: VentaDetalleDto[]; // Mapea a List<VentaDetalle>
}

// DTO para PUT (aunque el front-end no lo usa, es buena práctica tenerlo)
export class UpdateVentaDto {
  @IsOptional()
  @IsDateString()
  fecha?: string;

  @IsOptional()
  @IsString()
  cliente?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  total?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VentaDetalleDto)
  @IsOptional()
  detalles?: VentaDetalleDto[];
}