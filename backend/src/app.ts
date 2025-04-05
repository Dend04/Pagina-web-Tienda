import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import usuarioRoutes from './routes/usuario.routes';
import productoRoutes from './routes/producto.routes';
import pedidoRoutes from './routes/pedido.routes';

const prisma = new PrismaClient();
const app = express();
const port = process.env.PORT || 3001;

// Configuración básica
app.use(express.json());
app.use(cors());

// Configurar rutas
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/pedidos', pedidoRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`🚀 Servidor listo en http://localhost:${port}`);
});

// Cierre limpio de Prisma
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit();
});