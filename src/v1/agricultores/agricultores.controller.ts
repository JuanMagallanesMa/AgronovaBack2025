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
  Logger,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AgricultoresService } from 'src/agricultores/agricultores.service';
import {
  CreateAgricultorDto,
  UpdateAgricultorDto,
} from 'src/agricultores/dto/create-agricultor.dto';

@UseGuards(JwtAuthGuard)
@Controller('v1/agricultores')
export class AgricultoresController {
  private readonly logger = new Logger(AgricultoresController.name);

  constructor(private readonly agricultoresService: AgricultoresService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createAgricultorDto: CreateAgricultorDto) {
    this.logger.log('Recibiendo POST /v1/agricultores');
    return this.agricultoresService.create(createAgricultorDto);
  }

  @Get()
  findAll() {
    this.logger.log('Recibiendo GET /v1/agricultores');
    return this.agricultoresService.findAllActive();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    this.logger.log('Recibiendo GET /v1/agricultores/:id');
    return this.agricultoresService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateAgricultorDto: UpdateAgricultorDto,
  ) {
    this.logger.log('Recibiendo PUT /v1/agricultores/:id');
    return this.agricultoresService.update(id, updateAgricultorDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    this.logger.log('Recibiendo DELETE /v1/agricultores/:id');
    return this.agricultoresService.deleteLogically(id);
  }
}
