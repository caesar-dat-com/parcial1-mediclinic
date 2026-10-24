import Dexie, { type Table } from 'dexie';

/** Registro local: lo que se guarda en el equipo aunque no haya internet. */
export interface Registro {
  id?: number;
  titulo: string;
  detalle: string;
  lat?: number;
  lng?: number;
  foto?: string;
  creado: string;
  sincronizado: number; // 0 = pendiente, 1 = ya subido (Dexie no indexa booleanos)
}

class BaseLocal extends Dexie {
  registros!: Table<Registro, number>;

  constructor() {
    super('parcial2');
    this.version(1).stores({
      registros: '++id, titulo, creado, sincronizado',
    });
  }
}

export const db = new BaseLocal();
