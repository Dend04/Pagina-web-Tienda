import { Router } from 'express';
import { 
  addToCart,
  updateCartItem,
  removeFromCart,
  getUserCart
} from '../controllers/carrito.controllers';


const router = Router();

router.post('/',(req, res, next) =>{addToCart(req, res).catch(next);});
router.post('/:itemId',(req, res, next) =>{updateCartItem(req, res).catch(next);});
router.delete('/:itemId',(req, res, next) =>{removeFromCart(req, res).catch(next);});
router.get('/',(req, res, next) =>{getUserCart(req, res).catch(next);});


export default router;