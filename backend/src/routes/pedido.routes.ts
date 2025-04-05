import { Router } from 'express';
import {
  createPedido,
  getPedidosByUsuario,
  updateEstadoPedido
} from '../controllers/pedido.controllers';

const router = Router();

router.post('/', createPedido);
router.get('/usuario/:usuarioId', getPedidosByUsuario);
router.patch('/:id/estado', updateEstadoPedido);

export default router;