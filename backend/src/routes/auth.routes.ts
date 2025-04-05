import { Router } from 'express';
import { login } from '../controllers/auth.controllers';

const router = Router();

// Ruta de login
router.post('/',(req, res, next) =>{login(req, res).catch(next);});


export default router;