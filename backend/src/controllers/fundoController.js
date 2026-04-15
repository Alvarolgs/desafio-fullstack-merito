const fundosService = require("../services/fundoService");

function listarFundos(req, res) {
  try {
    return res.json(fundosService.getAllFundos());
  } catch (err) {
    return res.status(err.status || 500).json({
      erro: err.mensagem || "Erro ao listar fundos.",
      detalhe: err.message,
    });
  }
}

function buscarFundo(req, res) {
  try {
    return res.json(fundosService.getByIdFundo(req.params.id));
  } catch (err) {
    return res.status(err.status || 500).json({
      erro: err.mensagem || "Erro ao buscar fundo.",
      detalhe: err.message,
    });
  }
}

function criarFundo(req, res) {
  try {
    const novoFundo = fundosService.createFundo(req.body);
    return res.status(201).json(novoFundo);
  } catch (err) {
    return res.status(err.status || 500).json({
      erro: err.mensagem || "Erro ao criar fundo.",
      detalhe: err.message,
    });
  }
}

function atualizarFundo(req, res) {
  try {
    const fundoAtualizado = fundosService.updateFundo(req.params.id, req.body);
    return res.json(fundoAtualizado);
  } catch (err) {
    return res.status(err.status || 500).json({
      erro: err.mensagem || "Erro ao atualizar fundo.",
      detalhe: err.message,
    });
  }
}

function deletarFundo(req, res) {
  try {
    fundosService.deleteFundo(req.params.id);
    return res.json({ mensagem: "Fundo removido com sucesso." });
  } catch (err) {
    return res.status(err.status || 500).json({
      erro: err.mensagem || "Erro ao deletar fundo.",
      detalhe: err.message,
    });
  }
}

module.exports = {
  listarFundos,
  buscarFundo,
  criarFundo,
  atualizarFundo,
  deletarFundo,
};
