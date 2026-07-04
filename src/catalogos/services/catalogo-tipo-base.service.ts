import { CatalogosService, CatalogoTipo } from '../catalogos.service';

type CatalogoReferencia = {
  id: string;
  nombre: string;
  estado: boolean;
};

export class CatalogoTipoBaseService {
  constructor(
    private readonly catalogosService: CatalogosService,
    private readonly tipo: CatalogoTipo,
  ) {}

  findAllActive(): Promise<CatalogoReferencia[]> {
    return this.catalogosService.obtenerPorTipo(this.tipo);
  }

  create(createDto: { nombre: string; estado?: boolean }): Promise<CatalogoReferencia> {
    return this.catalogosService.crearCatalogo({ ...createDto, tipo: this.tipo });
  }

  update(id: string, updateDto: { nombre?: string; estado?: boolean }): Promise<CatalogoReferencia> {
    return this.catalogosService.actualizarCatalogo(id, updateDto);
  }

  deleteLogically(id: string): Promise<void> {
    return this.catalogosService.desactivarCatalogo(id);
  }
}
