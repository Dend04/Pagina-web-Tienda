// src/routes/favorito.routes.ts
import { Router } from "express";
import {
  addToFavorites,
  removeFromFavorites,
  getFavoritosByUsuario
} from "../controllers/favorito.controllers";

const router = Router();

router.post('/',(req, res, next) =>{addToFavorites(req, res).catch(next);});
router.delete("/:usuarioId/:productoId", removeFromFavorites);
router.get("/usuario/:usuarioId", getFavoritosByUsuario);

export default router;