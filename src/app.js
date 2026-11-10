import express from 'express';
import cors from 'cors';
import { checkStorage } from './config/storage.js';
import itemsRoutes from './routes/itemsRoutes.js';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
  res.json({ message: 'API activa' });
});

app.get('/health', async (_req, res) => {
  await checkStorage();
  res.json({ status: 'ok' });
});

app.use('/api/items', itemsRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
