import { ProductoDetallado } from '../controllers/producto.controllers';

declare global {
  namespace Express {
    export interface Response {
      json<T = unknown>(body?: T): this;
    }
  }
}