import Database from 'better-sqlite3';

const db = new Database(process.env.DATABASE_PATH);
db.pragma('foreign_keys = ON');

// Executa a função inteira como uma transação: ou tudo é gravado, ou nada.
export function transacao(fn) {
  return db.transaction(fn)();
}

export default db;
