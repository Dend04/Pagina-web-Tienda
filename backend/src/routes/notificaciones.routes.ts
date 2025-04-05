// src/routes/notificacion.routes.ts
import { Router } from "express";
import {
  createNotificacion,
  getNotificacionesByUsuario,
  deleteNotificacion
} from "../controllers/notificaciones.controllers";

const router = Router();

router.post('/',(req, res, next) =>{createNotificacion(req, res).catch(next);});
router.get("/usuario/:usuarioId", getNotificacionesByUsuario);
router.delete('/:id',(req, res, next) =>{deleteNotificacion(req, res).catch(next);});


export default router;