export function notFoundHandler(_req, res) {
  res.status(404).json({ error: 'Ruta no encontrada' });
}

export function errorHandler(error, _req, res, _next) {
  console.error(error);

  const status = error.status ?? 500;
  const message = status >= 500 ? 'Error interno del servidor' : error.message;

  res.status(status).json({ error: message });
}
