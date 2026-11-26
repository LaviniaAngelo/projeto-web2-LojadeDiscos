import express from 'express';
import authRoutes from './routes/authRoutes.js';
import discoRoutes from './routes/discoRoutes.js';
import pedidoRoutes from './routes/pedidoRoutes.js';
import errorHandler from './middlewares/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/ok', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/auth', authRoutes);
app.use('/discos', discoRoutes);
app.use('/pedidos', pedidoRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
