// src/tareas/tareas.controller.ts
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
import { CreateTareaDto, UpdateTareaDto } from 'src/tareas/dto/tarea.dto';
import { TareasService } from 'src/tareas/tareas.service';


@Controller('v1/tareas')
export class TareasController {
  constructor(private readonly tareasService: TareasService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createTareaDto: CreateTareaDto) {
    return this.tareasService.create(createTareaDto);
  }

  @Get()
  findAll() {
    return this.tareasService.findAllActive();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tareasService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateTareaDto: UpdateTareaDto) {
    return this.tareasService.update(id, updateTareaDto);
  }

  /**
   * Endpoint especial para actualizar estado (ej. 'Completada')
   * Mapea a TareaApi.updateEstado
   */
  @Put(':id/estado')
  @HttpCode(HttpStatus.OK)
  updateEstado(@Param('id') id: string, @Body('estado') estado: string) {
    return this.tareasService.updateStatus(id, estado);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.tareasService.deleteLogically(id);
  }
}