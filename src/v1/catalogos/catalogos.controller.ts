// src/catalogos/catalogos.controller.ts
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

import { CreateCatalogoDto, UpdateCatalogoDto } from 'src/catalogos/dto/catalogo.dto';
import { CategoriasCultivoService } from 'src/catalogos/services/categorias-cultivo/categorias-cultivo.service';
import { TiposInsumoService } from 'src/catalogos/services/tipos-insumo/tipos-insumo.service';
import { TiposTareaService } from 'src/catalogos/services/tipos-tarea/tipos-tarea.service';
import { UbicacionesService } from 'src/catalogos/services/ubicaciones/ubicaciones.service';

@Controller('v1/catalogos')
export class CatalogosController {
  constructor(
    private readonly categoriasCultivoService: CategoriasCultivoService,
    private readonly ubicacionesService: UbicacionesService,
    private readonly tiposInsumoService: TiposInsumoService,
    private readonly tiposTareaService: TiposTareaService,
  ) {}

  // --- Endpoints para Categorias de Cultivo ---
  @Get('categorias-cultivo')
  findAllCategorias() {
    return this.categoriasCultivoService.findAllActive();
  }
  @Post('categorias-cultivo')
  @HttpCode(HttpStatus.CREATED)
  createCategoria(@Body() createDto: CreateCatalogoDto) {
    return this.categoriasCultivoService.create(createDto);
  }
  @Put('categorias-cultivo/:id')
  updateCategoria(@Param('id') id: string, @Body() updateDto: UpdateCatalogoDto) {
    return this.categoriasCultivoService.update(id, updateDto);
  }
  @Delete('categorias-cultivo/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteCategoria(@Param('id') id: string) {
    return this.categoriasCultivoService.deleteLogically(id);
  }

  // --- Endpoints para Ubicaciones ---
  @Get('ubicaciones')
  findAllUbicaciones() {
    return this.ubicacionesService.findAllActive();
  }
  @Post('ubicaciones')
  @HttpCode(HttpStatus.CREATED)
  createUbicacion(@Body() createDto: CreateCatalogoDto) {
    return this.ubicacionesService.create(createDto);
  }
  @Put('ubicaciones/:id')
  updateUbicacion(@Param('id') id: string, @Body() updateDto: UpdateCatalogoDto) {
    return this.ubicacionesService.update(id, updateDto);
  }
  @Delete('ubicaciones/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteUbicacion(@Param('id') id: string) {
    return this.ubicacionesService.deleteLogically(id);
  }

  // --- Endpoints para Tipos de Insumo ---
  @Get('tipos-insumo')
  findAllTiposInsumo() {
    return this.tiposInsumoService.findAllActive();
  }
  @Post('tipos-insumo')
  @HttpCode(HttpStatus.CREATED)
  createTipoInsumo(@Body() createDto: CreateCatalogoDto) {
    return this.tiposInsumoService.create(createDto);
  }
  @Put('tipos-insumo/:id')
  updateTipoInsumo(@Param('id') id: string, @Body() updateDto: UpdateCatalogoDto) {
    return this.tiposInsumoService.update(id, updateDto);
  }
  @Delete('tipos-insumo/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteTipoInsumo(@Param('id') id: string) {
    return this.tiposInsumoService.deleteLogically(id);
  }

  // --- Endpoints para Tipos de Tarea ---
  @Get('tipos-tarea')
  findAllTiposTarea() {
    return this.tiposTareaService.findAllActive();
  }
  @Post('tipos-tarea')
  @HttpCode(HttpStatus.CREATED)
  createTipoTarea(@Body() createDto: CreateCatalogoDto) {
    return this.tiposTareaService.create(createDto);
  }
  @Put('tipos-tarea/:id')
  updateTipoTarea(@Param('id') id: string, @Body() updateDto: UpdateCatalogoDto) {
    return this.tiposTareaService.update(id, updateDto);
  }
  @Delete('tipos-tarea/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteTipoTarea(@Param('id') id: string) {
    return this.tiposTareaService.deleteLogically(id);
  }
}