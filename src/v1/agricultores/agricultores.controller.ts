// src/v1/agricultores/agricultores.controller.ts
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
  Logger, // Importa Logger para un logging más limpio (opcional)
} from '@nestjs/common';
import { AgricultoresService } from 'src/agricultores/agricultores.service';
import {
  CreateAgricultorDto,
  UpdateAgricultorDto,
} from 'src/agricultores/dto/create-agricultor.dto';

// La URL base será '/v1/agricultores'
@Controller('v1/agricultores')
export class AgricultoresController {
  // Opcional: Inicializa un Logger con el contexto del controlador
  private readonly logger = new Logger(AgricultoresController.name);

  constructor(private readonly agricultoresService: AgricultoresService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED) // Devuelve 201 Created
  create(@Body() createAgricultorDto: CreateAgricultorDto) {
    // --- AÑADIDO ---
    this.logger.log('--- [BACK-END] Recibiendo POST /v1/agricultores ---');
    console.log('BODY Recibido:', createAgricultorDto);
    // ---------------

    return this.agricultoresService.create(createAgricultorDto);
  }

  @Get()
  findAll() {
    // --- AÑADIDO ---
    this.logger.log('--- [BACK-END] Recibiendo GET /v1/agricultores ---');
    // ---------------

    return this.agricultoresService.findAllActive();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    // --- AÑADIDO ---
    this.logger.log(`--- [BACK-END] Recibiendo GET /v1/agricultores/${id} ---`);
    console.log('PARAM (id) Recibido:', id);
    // ---------------

    return this.agricultoresService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateAgricultorDto: UpdateAgricultorDto,
  ) {
    // --- AÑADIDO ---
    this.logger.log(`--- [BACK-END] Recibiendo PUT /v1/agricultores/${id} ---`);
    console.log('PARAM (id) Recibido:', id);
    console.log('BODY Recibido:', updateAgricultorDto);
    // ---------------

    return this.agricultoresService.update(id, updateAgricultorDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // Devuelve 204 No Content
  remove(@Param('id') id: string) {
    // --- AÑADIDO ---
    this.logger.log(
      `--- [BACK-END] Recibiendo DELETE /v1/agricultores/${id} ---`,
    );
    console.log('PARAM (id) Recibido:', id);
    // ---------------

    // El servicio base maneja el borrado lógico (pone estado: 'Inactivo')
    return this.agricultoresService.deleteLogically(id);
  }
}