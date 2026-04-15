const db = require("../database/db");

function findPosicoesComFundos() {
  return db
    .prepare(
      `
    SELECT
      f.id AS fundo_id,
      f.nome,
      f.ticker,
      f.tipo,
      f.valor_cota,
      COALESCE(c.quantidade_cotas, 0) AS quantidade_cotas,
      COALESCE(c.saldo_investido, 0) AS saldo_investido,
      COALESCE(c.quantidade_cotas, 0) * f.valor_cota AS valor_atual
    FROM fundos f
    LEFT JOIN carteira c ON c.fundo_id = f.id
    WHERE COALESCE(c.saldo_investido, 0) > 0
    ORDER BY f.nome ASC
  `,
    )
    .all();
}

module.exports = { findPosicoesComFundos };
