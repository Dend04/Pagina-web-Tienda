import { Router } from 'express';
import {
  getProductos,
  createProducto,
  updateProducto,
  deleteProducto,
  getProductoById
} from '../controllers/producto.controllers';

const router = Router();

router.get('/',(req, res, next) =>{getProductos(req, res).catch(next);});
/* router.get('/:id',(req, res, next) =>{getProducgetProductoByIdtos(req, res).catch(next);}); */
router.post('/',(req, res, next) =>{createProducto(req, res).catch(next);});
router.put('/:id',(req, res, next) =>{updateProducto(req, res).catch(next);});
router.get('/:id',(req, res, next) =>{deleteProducto(req, res).catch(next);});


export default router;