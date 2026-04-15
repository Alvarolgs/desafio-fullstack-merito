const db = require('../database/db');

function findAllWithFundo({ fundo_id, tipo, data_inicio, data_fim }) {
  let query = `
    SELECT 
      m.*,
      f.nome AS fundo_nome,
      f.ticker AS fundo_ticker,
      f.tipo AS fundo_tipo,
      f.valor_cota AS fundo_valor_cota
    FROM movimentacoes m
    INNER JOIN fundos f ON f.id = m.fundo_id
    WHERE 1=1
  `;
  const params = [];

  if (fundo_id) { query += ' AND m.fundo_id = ?'; params.push(fundo_id); }
  if (tipo)     { query += ' AND m.tipo = ?';     params.push(tipo); }
  if (data_inicio) { query += ' AND m.data >= ?'; params.push(data_inicio); }
  if (data_fim)    { query += ' AND m.data <= ?'; params.push(data_fim); }

  query += ' ORDER BY m.data DESC, m.id DESC';

  return db.prepare(query).all(...params);
}

function findById(id) {
  return db.prepare('SELECT * FROM movimentacoes WHERE id = ?').get(id);
}

function findByIdWithFundo(id) {
  return db.prepare(`
    SELECT m.*, f.nome AS fundo_nome, f.ticker AS fundo_ticker
    FROM movimentacoes m
    INNER JOIN fundos f ON f.id = m.fundo_id
    WHERE m.id = ?
  `).get(id);
}

function findCarteiraPorFundo(fundo_id) {
  return db.prepare('SELECT * FROM carteira WHERE fundo_id = ?').get(fundo_id);
}

function insertMovimentacao({ fundo_id, tipo, valorFloat, quantidadeCotas, data, observacao }) {
  return db.prepare(`
    INSERT INTO movimentacoes (fundo_id, tipo, valor, quantidade_cotas, data, observacao)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(fundo_id, tipo, valorFloat, quantidadeCotas, data, observacao || null);
}

function insertCarteira({ fundo_id, quantidadeCotas, valorFloat }) {
  return db.prepare(`
    INSERT INTO carteira (fundo_id, quantidade_cotas, saldo_investido)
    VALUES (?, ?, ?)
  `).run(fundo_id, quantidadeCotas, valorFloat);
}

function incrementCarteira({ fundo_id, quantidadeCotas, valorFloat }) {
  return db.prepare(`
    UPDATE carteira SET
      quantidade_cotas = quantidade_cotas + ?,
      saldo_investido = saldo_investido + ?
    WHERE fundo_id = ?
  `).run(quantidadeCotas, valorFloat, fundo_id);
}

function decrementCarteira({ fundo_id, quantidadeCotas, valorFloat }) {
  return db.prepare(`
    UPDATE carteira SET
      quantidade_cotas = quantidade_cotas - ?,
      saldo_investido = saldo_investido - ?
    WHERE fundo_id = ?
  `).run(quantidadeCotas, valorFloat, fundo_id);
}

function deleteMovimentacao(id) {
  return db.prepare('DELETE FROM movimentacoes WHERE id = ?').run(id);
}

function registrarMovimentacaoTransaction({ fundo_id, tipo, valorFloat, quantidadeCotas, data, observacao, posicaoAtual }) {
  return db.transaction(() => {
    const resultado = insertMovimentacao({ fundo_id, tipo, valorFloat, quantidadeCotas, data, observacao });

    if (tipo === 'aporte') {
      posicaoAtual
        ? incrementCarteira({ fundo_id, quantidadeCotas, valorFloat })
        : insertCarteira({ fundo_id, quantidadeCotas, valorFloat });
    } else {
      decrementCarteira({ fundo_id, quantidadeCotas, valorFloat });
    }

    return resultado.lastInsertRowid;
  })();
}

function deletarMovimentacaoTransaction(mov) {
  return db.transaction(() => {
    if (mov.tipo === 'aporte') {
      decrementCarteira({ fundo_id: mov.fundo_id, quantidadeCotas: mov.quantidade_cotas, valorFloat: mov.valor });
    } else {
      incrementCarteira({ fundo_id: mov.fundo_id, quantidadeCotas: mov.quantidade_cotas, valorFloat: mov.valor });
    }

    deleteMovimentacao(mov.id);
  })();
}

module.exports = {
  findAllWithFundo,
  findById,
  findByIdWithFundo,
  findCarteiraPorFundo,
  registrarMovimentacaoTransaction,
  deletarMovimentacaoTransaction,
};