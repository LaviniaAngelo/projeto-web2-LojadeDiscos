-- migrate:up
CREATE TABLE pedidos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  disco_id INTEGER NOT NULL REFERENCES discos(id),
  quantidade INTEGER NOT NULL CHECK (quantidade > 0),
  valor_total REAL NOT NULL,
  data_pedido TEXT NOT NULL DEFAULT (date('now')),
  status TEXT NOT NULL DEFAULT 'pendente',
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id)
);

-- migrate:down
DROP TABLE pedidos;
