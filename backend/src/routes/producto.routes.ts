import { Router } from 'express';
import {
  getProductos,
  createProducto,
  updateProducto,
  deleteProducto,
  getProductoById
} from '../controllers/producto.controllers';

const router = Router();

router.get('/', getProductos);
/* router.get('/:id', getProductoById); */
router.post('/', createProducto);
router.put('/:id', updateProducto);
router.delete('/:id', deleteProducto);

export default router;