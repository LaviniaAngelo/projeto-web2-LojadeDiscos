import db from '../database/connection.js';

const COLUNAS =
  'id, disco_id AS discoId, quantidade, valor_total AS valorTotal, data_pedido AS dataPedido, status, usuario_id AS usuarioId';

export function findAllByUsuario(usuarioId) {
  return db.prepare(`SELECT ${COLUNAS} FROM pedidos WHERE usuario_id = ?`).all(usuarioId);
}

export function findById(id) {
  return db.prepare(`SELECT ${COLUNAS} FROM pedidos WHERE id = ?`).get(id);
}

export function existePorDisco(discoId) {
  return db.prepare('SELECT 1 FROM pedidos WHERE disco_id = ? LIMIT 1').get(discoId) !== undefined;
}

export function create({ discoId, quantidade, valorTotal, usuarioId }) {
  return db
    .prepare(
      `INSERT INTO pedidos (disco_id, quantidade, valor_total, usuario_id)
       VALUES (?, ?, ?, ?) RETURNING ${COLUNAS}`
    )
    .get(discoId, quantidade, valorTotal, usuarioId);
}

export function updateQuantidade(id, quantidade, valorTotal) {
  return db
    .prepare(`UPDATE pedidos SET quantidade = ?, valor_total = ? WHERE id = ? RETURNING ${COLUNAS}`)
    .get(quantidade, valorTotal, id);
}

export function updateStatus(id, status) {
  return db
    .prepare(`UPDATE pedidos SET status = ? WHERE id = ? RETURNING ${COLUNAS}`)
    .get(status, id);
}

export function remove(id) {
  db.prepare('DELETE FROM pedidos WHERE id = ?').run(id);
}
