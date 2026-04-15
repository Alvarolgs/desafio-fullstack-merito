const movimentacoesService = require("../services/movimentacaoService");

function listarMovimentacoes(req, res) {
  try {
    return res.json(movimentacoesService.getAllMovimentacoes(req.query));
  } catch (err) {
    return res
      .status(err.status || 500)
      .json({
        erro: err.mensagem || "Erro ao listar movimentações.",
        detalhe: err.message,
      });
  }
}

function registrarMovimentacao(req, res) {
  try {
    const movimentacao = movimentacoesService.createMovimentacao(req.body);
    return res.status(201).json(movimentacao);
  } catch (err) {
    return res
      .status(err.status || 500)
      .json({
        erro: err.mensagem || "Erro ao registrar movimentação.",
        detalhe: err.message,
      });
  }
}

function deletarMovimentacao(req, res) {
  try {
    movimentacoesService.deleteMovimentacao(req.params.id);
    return res.json({
      mensagem: "Movimentação removida e carteira atualizada com sucesso.",
    });
  } catch (err) {
    return res
      .status(err.status || 500)
      .json({
        erro: err.mensagem || "Erro ao deletar movimentação.",
        detalhe: err.message,
      });
  }
}

module.exports = {
  listarMovimentacoes,
  registrarMovimentacao,
  deletarMovimentacao,
};
