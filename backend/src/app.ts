import express, { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import { logToFile, requestLogger } from './config/logger';
import usuarioRoutes from './routes/usuario.routes';
import productoRoutes from './routes/producto.routes';
import pedidoRoutes from './routes/pedido.routes';
import notificacionesRoutes from './routes/notificaciones.routes';
import favoritosRoutes from './routes/favorito.routes';
import authRoutes from './routes/auth.routes';

const prisma = new PrismaClient();
const app = express();
const port = process.env.PORT || 3001;

app.use(requestLogger);

// Configuración básica
app.use(express.json());
app.use(cors());

// Configurar rutas
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/pedidos', pedidoRoutes);
app.use('/api/notificaciones', notificacionesRoutes);
app.use('/api/favoritos', favoritosRoutes);
app.use('/api/auth', authRoutes);


// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Manejador de errores centralizado
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  const errorData = {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    body: req.body
  };

  // Log en consola
  console.error(`${new Date().toISOString()} - ERROR: ${err.message}`);
  
  // Log en archivo
  logToFile('ERROR', 'Unhandled Error', errorData);

  res.status(500).json({
    error: 'Error interno del servidor',
    detalles: process.env.NODE_ENV === 'development' ? err.message : null
  });
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`🚀 Servidor en http://localhost:${port}`);
});

// Cierre limpio de Prisma
process.on('SIGINT', async () => {
  await logToFile('INFO', 'Server shutdown initiated');
  await prisma.$disconnect();
  process.exit();
});