const movimentacaoRepository = require('../repositories/movimentacaoRepositories');
const fundoRepository = require('../repositories/fundoRepositories');

function getAllMovimentacoes(filtros) {
  return movimentacaoRepository.findAllWithFundo(filtros);
}

function createMovimentacao({ fundo_id, tipo, valor, data, observacao }) {
  if (!fundo_id || !tipo || !valor || !data) {
    throw { status: 400, mensagem: 'Campos obrigatórios: fundo_id, tipo, valor, data.' };
  }

  if (!['aporte', 'resgate'].includes(tipo)) {
    throw { status: 400, mensagem: 'Tipo deve ser "aporte" ou "resgate".' };
  }

  const valorFloat = parseFloat(valor);

  if (valorFloat <= 0) {
    throw { status: 400, mensagem: 'O valor deve ser maior que zero.' };
  }

  const fundo = fundoRepository.findById(fundo_id);
  if (!fundo) {
    throw { status: 404, mensagem: 'Fundo não encontrado.' };
  }

  const quantidadeCotas = valorFloat / fundo.valor_cota;
  const posicaoAtual = movimentacaoRepository.findCarteiraPorFundo(fundo_id);

  if (tipo === 'resgate') {
    if (!posicaoAtual || posicaoAtual.saldo_investido < valorFloat) {
      throw { status: 400, mensagem: 'Saldo insuficiente para realizar o resgate.' };
    }
  }

  const novoId = movimentacaoRepository.registrarMovimentacaoTransaction({
    fundo_id, tipo, valorFloat, quantidadeCotas, data, observacao, posicaoAtual,
  });

  return movimentacaoRepository.findByIdWithFundo(novoId);
}

function deleteMovimentacao(id) {
  const mov = movimentacaoRepository.findById(id);
  if (!mov) {
    throw { status: 404, mensagem: 'Movimentação não encontrada.' };
  }

  movimentacaoRepository.deletarMovimentacaoTransaction(mov);
}

module.exports = { getAllMovimentacoes, createMovimentacao, deleteMovimentacao };