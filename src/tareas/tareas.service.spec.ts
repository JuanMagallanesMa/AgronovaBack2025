import { BadRequestException } from '@nestjs/common';

jest.mock('src/firebase/firebase.module', () => ({
  FIRESTORE_PROVIDER: 'FIRESTORE_PROVIDER',
}), { virtual: true });

jest.mock('../agricultores/agricultores.service', () => ({
  AgricultoresService: class AgricultoresService {},
}));
jest.mock('../catalogos/catalogos.service', () => ({
  CatalogosService: class CatalogosService {},
}));
jest.mock('../cultivos/cultivos.service', () => ({
  CultivosService: class CultivosService {},
}));
jest.mock('../insumos/insumos.service', () => ({
  InsumosService: class InsumosService {},
}));

import { TareasService } from './tareas.service';

const tareaBase = {
  nombre: 'Riego',
  fechaInicio: '2026-07-10',
  fechaFin: '2026-07-12',
  idCultivo: 'cultivo-1',
  idTipoTarea: 'tipo-1',
  descripcion: 'Riego inicial',
  idAgricultores: ['agricultor-1'],
  insumosAsignados: [{ idInsumo: 'insumo-1', cantidad: 2 }],
};

describe('TareasService', () => {
  let service: TareasService;
  let catalogosService: { validarReferencia: jest.Mock };
  let cultivosService: { findOne: jest.Mock };
  let agricultoresService: { findOne: jest.Mock };
  let insumosService: { findOne: jest.Mock };

  beforeEach(() => {
    const collection = jest.fn(() => ({
      add: jest.fn(),
      doc: jest.fn(() => ({ get: jest.fn(), update: jest.fn() })),
    }));

    catalogosService = { validarReferencia: jest.fn().mockResolvedValue(undefined) };
    cultivosService = { findOne: jest.fn().mockResolvedValue({ id: 'cultivo-1', estado: 'Activo' }) };
    agricultoresService = { findOne: jest.fn().mockResolvedValue({ id: 'agricultor-1', estado: 'Activo' }) };
    insumosService = { findOne: jest.fn().mockResolvedValue({ id: 'insumo-1', estado: 'Activo' }) };

    service = new TareasService(
      { collection } as never,
      catalogosService as never,
      cultivosService as never,
      agricultoresService as never,
      insumosService as never,
    );
  });

  it('rechaza crear una tarea con fecha fin anterior a fecha inicio', async () => {
    await expect(
      service.create({ ...tareaBase, fechaFin: '2026-07-09' }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('rechaza crear una tarea con cultivo inexistente o inactivo', async () => {
    cultivosService.findOne.mockResolvedValue({ id: 'cultivo-1', estado: 'Inactivo' });

    await expect(service.create(tareaBase)).rejects.toBeInstanceOf(BadRequestException);
  });

  it('rechaza crear una tarea con agricultor inexistente o inactivo', async () => {
    agricultoresService.findOne.mockRejectedValue(new Error('no existe'));

    await expect(service.create(tareaBase)).rejects.toBeInstanceOf(BadRequestException);
  });

  it('rechaza crear una tarea con insumo inexistente o inactivo', async () => {
    insumosService.findOne.mockResolvedValue({ id: 'insumo-1', estado: 'Inactivo' });

    await expect(service.create(tareaBase)).rejects.toBeInstanceOf(BadRequestException);
  });

  it('en update valida fecha fin contra la fecha inicio existente', async () => {
    jest.spyOn(service, 'findOne').mockResolvedValue({
      id: 'tarea-1',
      estado: 'Pendiente',
      ...tareaBase,
      fechaInicio: '2026-07-10',
      fechaFin: '2026-07-12',
    });

    await expect(
      service.update('tarea-1', { fechaFin: '2026-07-09' }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});