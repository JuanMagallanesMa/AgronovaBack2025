import { Controller, Post, Body } from '@nestjs/common';
import { IaService } from './ia.service';

@Controller('v1/ia')
export class IaController {
  constructor(private readonly iaService: IaService) {}

  // Endpoint 1: Chat de Texto
  @Post('consultar')
  async consultar(@Body() body: { pregunta: string; contexto?: string }) {
    return this.iaService.consultarAsistente(body.pregunta, body.contexto);
  }

  // Endpoint 2: Comandos de Voz
  @Post('comando')
  async comandoVoz(@Body() body: { texto: string; idAgricultor: string }) {
    return this.iaService.procesarComandoDeVoz(body.texto, body.idAgricultor);
  }
}