import assert from 'node:assert/strict';
import 'dotenv/config';

const baseUrl =
  process.env.API_URL ??
  `http://127.0.0.1:${process.env.APP_PORT ?? 3000}`;
const itemToCreate = {
  name: `prueba-${Date.now()}`,
  description: 'Lectura y escritura entre la API y PostgreSQL',
};
let itemId;

try {
  const createResponse = await fetch(`${baseUrl}/api/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(itemToCreate),
  });
  assert.equal(createResponse.status, 201, 'La API debe guardar el elemento');

  const createdItem = await createResponse.json();
  itemId = createdItem.id;
  assert.ok(itemId, 'La respuesta debe incluir el identificador guardado');

  const readResponse = await fetch(`${baseUrl}/api/items/${itemId}`);
  assert.equal(readResponse.status, 200, 'La API debe leer el elemento guardado');

  const readItem = await readResponse.json();
  assert.deepEqual(readItem, { id: itemId, ...itemToCreate });

  console.log('Prueba de integración correcta: el elemento se guardó y se leyó.');
} finally {
  if (itemId) {
    const deleteResponse = await fetch(`${baseUrl}/api/items/${itemId}`, {
      method: 'DELETE',
    });
    assert.equal(deleteResponse.status, 204, 'La prueba debe limpiar su elemento');
  }
}
