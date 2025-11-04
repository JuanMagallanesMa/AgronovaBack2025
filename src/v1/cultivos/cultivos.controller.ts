// src/cultivos/cultivos.controller.ts
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
import { CultivosService } from 'src/cultivos/cultivos.service';
import { CreateCultivoDto, UpdateCultivoDto } from 'src/cultivos/dto/cultivo.dto';


@Controller('v1/cultivos')
export class CultivosController {
  constructor(private readonly cultivosService: CultivosService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createCultivoDto: CreateCultivoDto) {
    return this.cultivosService.create(createCultivoDto);
  }

  @Get()
  findAll() {
    return this.cultivosService.findAllActive();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.cultivosService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateCultivoDto: UpdateCultivoDto) {
    return this.cultivosService.update(id, updateCultivoDto);
  }

  /**
   * Endpoint especial para actualizar solo el estado.
   * Mapea a CultivoApi.updateEstado en Flutter
   */
  @Put(':id/estado')
  @HttpCode(HttpStatus.OK)
  updateEstado(@Param('id') id: string, @Body('estado') estado: string) {
    // Usa el método genérico de BaseService
    return this.cultivosService.updateStatus(id, estado);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    // El borrado estándar es poner 'Inactivo'
    return this.cultivosService.deleteLogically(id);
  }
}