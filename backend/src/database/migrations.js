const db = require('./db');

function runMigrations() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS fundos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      ticker TEXT NOT NULL UNIQUE,
      tipo TEXT NOT NULL CHECK(tipo IN ('Renda Fixa', 'Renda Variável', 'Multimercado', 'FII', 'Ações', 'Exterior')),
      valor_cota REAL NOT NULL CHECK(valor_cota > 0),
      created_at TEXT NOT NULL DEFAULT (datetime('now','localtime')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now','localtime'))
    );

    CREATE TABLE IF NOT EXISTS movimentacoes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fundo_id INTEGER NOT NULL,
      tipo TEXT NOT NULL CHECK(tipo IN ('aporte', 'resgate')),
      valor REAL NOT NULL CHECK(valor > 0),
      quantidade_cotas REAL NOT NULL,
      data TEXT NOT NULL,
      observacao TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now','localtime')),
      FOREIGN KEY (fundo_id) REFERENCES fundos(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS carteira (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fundo_id INTEGER NOT NULL UNIQUE,
      quantidade_cotas REAL NOT NULL DEFAULT 0,
      saldo_investido REAL NOT NULL DEFAULT 0,
      FOREIGN KEY (fundo_id) REFERENCES fundos(id) ON DELETE CASCADE
    );
  `);
}

module.exports = { runMigrations };
