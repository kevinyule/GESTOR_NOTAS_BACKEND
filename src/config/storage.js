import { randomUUID } from 'node:crypto';
import pg from 'pg';

const { Pool } = pg;
const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

export async function initializeStorage() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS items (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '',
      created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

export async function checkStorage() {
  await pool.query('SELECT 1');
}

export async function getItems() {
  const { rows } = await pool.query(
    'SELECT id, name, description FROM items ORDER BY created_at, id',
  );
  return rows;
}

export async function getItemById(id) {
  const { rows } = await pool.query(
    'SELECT id, name, description FROM items WHERE id = $1',
    [id],
  );
  return rows[0];
}

export async function createItem({ name, description }) {
  const id = randomUUID();
  const { rows } = await pool.query(
    'INSERT INTO items (id, name, description) VALUES ($1, $2, $3) RETURNING id, name, description',
    [id, name, description],
  );
  return rows[0];
}

export async function updateItem(id, { name, description }) {
  const { rows } = await pool.query(
    'UPDATE items SET name = $2, description = $3 WHERE id = $1 RETURNING id, name, description',
    [id, name, description],
  );
  return rows[0];
}

export async function deleteItem(id) {
  const { rowCount } = await pool.query('DELETE FROM items WHERE id = $1', [id]);
  return rowCount > 0;
}
