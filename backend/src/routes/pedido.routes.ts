import { Router } from 'express';
import {
  createPedido,
  getPedidosByUsuario,
  updateEstadoPedido
} from '../controllers/pedido.controllers';

const router = Router();

router.post('/',(req, res, next) =>{createPedido(req, res).catch(next);});
router.get('/usuario/:usuarioId',(req, res, next) =>{getPedidosByUsuario(req, res).catch(next);});
router.patch('/:id/estado',(req, res, next) =>{createPedido(req, res).catch(next);});


export default router;