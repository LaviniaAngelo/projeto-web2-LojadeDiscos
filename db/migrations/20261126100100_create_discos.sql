-- migrate:up
CREATE TABLE discos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  titulo TEXT NOT NULL,
  artista TEXT NOT NULL,
  genero TEXT NOT NULL,
  preco REAL NOT NULL CHECK (preco > 0),
  estoque INTEGER NOT NULL CHECK (estoque >= 0),
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id)
);

-- migrate:down
DROP TABLE discos;
