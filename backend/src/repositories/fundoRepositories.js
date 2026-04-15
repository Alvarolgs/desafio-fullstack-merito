const db = require("../database/db");

function findAllWithCarteira() {
  return db
    .prepare(
      `
    SELECT 
      f.*,
      COALESCE(c.quantidade_cotas, 0) AS quantidade_cotas_carteira,
      COALESCE(c.saldo_investido, 0) AS saldo_investido
    FROM fundos f
    LEFT JOIN carteira c ON c.fundo_id = f.id
    ORDER BY f.nome ASC
  `,
    )
    .all();
}

function findByIdWithCarteira(id) {
  return db
    .prepare(
      `
    SELECT 
      f.*,
      COALESCE(c.quantidade_cotas, 0) AS quantidade_cotas_carteira,
      COALESCE(c.saldo_investido, 0) AS saldo_investido
    FROM fundos f
    LEFT JOIN carteira c ON c.fundo_id = f.id
    WHERE f.id = ?
  `,
    )
    .get(id);
}

function findById(id) {
  return db.prepare("SELECT * FROM fundos WHERE id = ?").get(id);
}

function findByTicker(ticker) {
  return db.prepare("SELECT id FROM fundos WHERE ticker = ?").get(ticker);
}

function findByTickerExcludingId(ticker, id) {
  return db
    .prepare("SELECT id FROM fundos WHERE ticker = ? AND id != ?")
    .get(ticker, id);
}

function insertFundo(nome, ticker, tipo, valor_cota) {
  return db
    .prepare(
      `
    INSERT INTO fundos (nome, ticker, tipo, valor_cota)
    VALUES (?, ?, ?, ?)
  `,
    )
    .run(nome, ticker, tipo, valor_cota);
}

function updateFundo({ nome, ticker, tipo, valor_cota, id }) {
  return db
    .prepare(
      `
    UPDATE fundos SET
      nome = COALESCE(?, nome),
      ticker = COALESCE(?, ticker),
      tipo = COALESCE(?, tipo),
      valor_cota = COALESCE(?, valor_cota),
      updated_at = datetime('now','localtime')
    WHERE id = ?
  `,
    )
    .run(nome, ticker, tipo, valor_cota, id);
}

function deleteFundo(id) {
  return db.prepare("DELETE FROM fundos WHERE id = ?").run(id);
}

module.exports = {
  findAllWithCarteira,
  findByIdWithCarteira,
  findById,
  findByTicker,
  findByTickerExcludingId,
  insertFundo,
  updateFundo,
  deleteFundo,
};
