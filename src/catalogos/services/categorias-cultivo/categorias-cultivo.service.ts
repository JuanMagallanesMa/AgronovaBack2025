import { Injectable } from '@nestjs/common';

import { CatalogosService } from 'src/catalogos/catalogos.service';
import { CatalogoTipoBaseService } from '../catalogo-tipo-base.service';

@Injectable()
export class CategoriasCultivoService extends CatalogoTipoBaseService {
  constructor(catalogosService: CatalogosService) {
    super(catalogosService, 'categoria-cultivo');
  }
}
