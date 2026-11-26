
import db from '../database/connection.js';

const COLUNAS = 'id, titulo, artista, genero, preco, estoque, usuario_id AS usuarioId';

export function findAll() {
  return db.prepare(`SELECT ${COLUNAS} FROM discos`).all();
}

export function findById(id) {
  return db.prepare(`SELECT ${COLUNAS} FROM discos WHERE id = ?`).get(id);
}

export function create({ titulo, artista, genero, preco, estoque, usuarioId }) {
  return db
    .prepare(
      `INSERT INTO discos (titulo, artista, genero, preco, estoque, usuario_id)
       VALUES (?, ?, ?, ?, ?, ?) RETURNING ${COLUNAS}`
    )
    .get(titulo, artista, genero, preco, estoque, usuarioId);
}

export function update(id, { titulo, artista, genero, preco, estoque }) {
  return db
    .prepare(
      `UPDATE discos SET titulo = ?, artista = ?, genero = ?, preco = ?, estoque = ?
       WHERE id = ? RETURNING ${COLUNAS}`
    )
    .get(titulo, artista, genero, preco, estoque, id);
}

// delta negativo tira do estoque, positivo devolve
export function ajustarEstoque(id, delta) {
  db.prepare('UPDATE discos SET estoque = estoque + ? WHERE id = ?').run(delta, id);
}

export function remove(id) {
  db.prepare('DELETE FROM discos WHERE id = ?').run(id);
}
