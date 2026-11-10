import 'dotenv/config';
import app from './src/app.js';
import { initializeStorage } from './src/config/storage.js';

const port = Number(process.env.PORT || 3000);

async function startServer() {
  await initializeStorage();

  app.listen(port, '0.0.0.0', () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
  });
}

startServer().catch((error) => {
  console.error('No se pudo iniciar el servidor:', error);
  process.exitCode = 1;
});
