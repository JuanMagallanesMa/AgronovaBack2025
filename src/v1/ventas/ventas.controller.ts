// src/ventas/ventas.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CreateVentaDto, UpdateVentaDto } from 'src/ventas/dto/venta.dto';
import { VentasService } from 'src/ventas/ventas.service';


@Controller('v1/ventas')
export class VentasController {
  constructor(private readonly ventasService: VentasService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createVentaDto: CreateVentaDto) {
    // Llama al método 'create' sobrescrito (que pone estado 'Pendiente')
    return this.ventasService.create(createVentaDto);
  }

  @Get()
  findAll() {
    // El BaseService ya filtra 'Anulada' (porque no está en la lista de activos)
    return this.ventasService.findAllActive();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ventasService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateVentaDto: UpdateVentaDto) {
    return this.ventasService.update(id, updateVentaDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    // Llama al método 'deleteLogically' sobrescrito (que pone estado 'Anulada')
    return this.ventasService.deleteLogically(id);
  }
}