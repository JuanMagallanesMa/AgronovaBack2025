// src/agricultores/agricultores.controller.ts
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
import { AgricultoresService } from 'src/agricultores/agricultores.service';
import { CreateAgricultorDto, UpdateAgricultorDto } from 'src/agricultores/dto/create-agricultor.dto';
// La URL base será '/v1/agricultores'
@Controller('v1/agricultores')
export class AgricultoresController {
  constructor(private readonly agricultoresService: AgricultoresService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED) // Devuelve 201 Created
  create(@Body() createAgricultorDto: CreateAgricultorDto) {
    return this.agricultoresService.create(createAgricultorDto);
  }

  @Get()
  findAll() {
    return this.agricultoresService.findAllActive();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.agricultoresService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateAgricultorDto: UpdateAgricultorDto,
  ) {
    return this.agricultoresService.update(id, updateAgricultorDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // Devuelve 204 No Content
  remove(@Param('id') id: string) {
    // El servicio base maneja el borrado lógico (pone estado: 'Inactivo')
    return this.agricultoresService.deleteLogically(id);
  }
}