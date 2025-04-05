import { Router } from 'express';
import {
  getUsuarios,
  getUsuarioById,
  createUsuario,
  updateUsuario,
  deleteUsuario
} from '../controllers/usuario.controllers';

const router = Router();

router.get('/', (req, res, next) => {
  getUsuarios(req, res).catch(next);
});
router.get('/:id',(req, res, next) =>{getUsuarioById(req, res).catch(next);});
router.post('/',(req, res, next) =>{createUsuario(req, res).catch(next);});
router.put('/:id',(req, res, next) =>{updateUsuario(req, res).catch(next);});
router.delete('/:id',(req, res, next) =>{deleteUsuario(req, res).catch(next);});


export default router;