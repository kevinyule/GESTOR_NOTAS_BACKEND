import {
  createItem,
  deleteItem,
  getItemById,
  getItems,
  updateItem,
} from '../config/storage.js';

function validateItem(body) {
  if (typeof body?.name !== 'string' || body.name.trim() === '') {
    return 'El campo name es obligatorio y debe ser texto';
  }

  if (body.description !== undefined && typeof body.description !== 'string') {
    return 'El campo description debe ser texto';
  }

  return undefined;
}

export async function listItems(_req, res) {
  res.json(await getItems());
}

export async function findItem(req, res) {
  const item = await getItemById(req.params.id);

  if (!item) {
    return res.status(404).json({ error: 'Elemento no encontrado' });
  }

  return res.json(item);
}

export async function addItem(req, res) {
  const validationError = validateItem(req.body);

  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  const item = await createItem({
    name: req.body.name.trim(),
    description: req.body.description?.trim() ?? '',
  });

  return res.status(201).json(item);
}

export async function replaceItem(req, res) {
  const validationError = validateItem(req.body);

  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  const item = await updateItem(req.params.id, {
    name: req.body.name.trim(),
    description: req.body.description?.trim() ?? '',
  });

  if (!item) {
    return res.status(404).json({ error: 'Elemento no encontrado' });
  }

  return res.json(item);
}

export async function removeItem(req, res) {
  if (!(await deleteItem(req.params.id))) {
    return res.status(404).json({ error: 'Elemento no encontrado' });
  }

  return res.status(204).end();
}
