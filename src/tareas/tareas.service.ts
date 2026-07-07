import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Firestore } from 'firebase-admin/firestore';

import { AgricultoresService } from '../agricultores/agricultores.service';
import { CatalogosService } from '../catalogos/catalogos.service';
import { AppStatus } from '../common/app.constants';
import { BaseService } from '../common/base.service';
import { CultivosService } from '../cultivos/cultivos.service';
import { FIRESTORE_PROVIDER } from '../firebase/firebase.module';
import { InsumosService } from '../insumos/insumos.service';
import { CreateTareaDto, Tarea, UpdateTareaDto } from './dto/tarea.dto';

@Injectable()
export class TareasService extends BaseService<Tarea> {
  constructor(
    @Inject(FIRESTORE_PROVIDER)
    protected readonly firestore: Firestore,
    private readonly catalogosService: CatalogosService,
    private readonly cultivosService: CultivosService,
    private readonly agricultoresService: AgricultoresService,
    private readonly insumosService: InsumosService,
  ) {
    super(firestore, 'tareas');
  }

  override async create(createDto: CreateTareaDto): Promise<Tarea> {
    this.validarRangoFechas(createDto.fechaInicio, createDto.fechaFin);

    await this.catalogosService.validarReferencia(
      createDto.idTipoTarea,
      'tipo-tarea',
    );
    await this.validarCultivo(createDto.idCultivo);
    await this.validarAgricultores(createDto.idAgricultores);
    await this.validarInsumos(createDto.insumosAsignados);

    return super.create(createDto);
  }

  override async update(id: string, updateDto: UpdateTareaDto): Promise<Tarea> {
    const tareaActual = await this.findOne(id);
    const fechaInicio = updateDto.fechaInicio ?? tareaActual.fechaInicio;
    const fechaFin = updateDto.fechaFin ?? tareaActual.fechaFin;

    this.validarRangoFechas(fechaInicio, fechaFin);

    if (updateDto.idTipoTarea) {
      await this.catalogosService.validarReferencia(
        updateDto.idTipoTarea,
        'tipo-tarea',
      );
    }

    if (updateDto.idCultivo) {
      await this.validarCultivo(updateDto.idCultivo);
    }

    if (updateDto.idAgricultores) {
      await this.validarAgricultores(updateDto.idAgricultores);
    }

    if (updateDto.insumosAsignados) {
      await this.validarInsumos(updateDto.insumosAsignados);
    }

    return super.update(id, updateDto);
  }

  private validarRangoFechas(fechaInicio: string, fechaFin: string): void {
    if (fechaInicio > fechaFin) {
      throw new BadRequestException(
        'La fecha de fin no puede ser anterior a la fecha de inicio.',
      );
    }
  }

  private async validarCultivo(idCultivo: string): Promise<void> {
    await this.validarReferenciaActiva(
      () => this.cultivosService.findOne(idCultivo),
      'El cultivo seleccionado no existe o no esta activo.',
    );
  }

  private async validarAgricultores(idAgricultores?: string[]): Promise<void> {
    if (!idAgricultores?.length) {
      return;
    }

    await Promise.all(
      idAgricultores.map((id) =>
        this.validarReferenciaActiva(
          () => this.agricultoresService.findOne(id),
          'Uno o mas agricultores seleccionados no existen o no estan activos.',
        ),
      ),
    );
  }

  private async validarInsumos(
    insumosAsignados?: CreateTareaDto['insumosAsignados'],
  ): Promise<void> {
    if (!insumosAsignados?.length) {
      return;
    }

    await Promise.all(
      insumosAsignados.map((item) =>
        this.validarReferenciaActiva(
          () => this.insumosService.findOne(item.idInsumo),
          'Uno o mas insumos asignados no existen o no estan activos.',
        ),
      ),
    );
  }

  private async validarReferenciaActiva(
    getReferencia: () => Promise<{ estado?: string }>,
    mensaje: string,
  ): Promise<void> {
    try {
      const referencia = await getReferencia();

      if (referencia.estado === AppStatus.inactivo) {
        throw new Error(mensaje);
      }
    } catch {
      throw new BadRequestException(mensaje);
    }
  }
}