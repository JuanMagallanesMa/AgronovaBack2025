// src/common/base.interface.ts
export interface IBaseModel {
  id: string;
  estado: string;
}

/**
 * Interfaz para todos los modelos de catálogo simples
 * (CategoriaCultivo, Ubicacion, TipoInsumo, TipoTarea)
 */
export interface ReferenciaBase extends IBaseModel {
  nombre: string;
}
