const carteiraService = require("../services/carteiraService");

function resumoCarteira(req, res) {
  try {
    const resumo = carteiraService.getResumoCarteira();
    return res.json(resumo);
  } catch (err) {
    return res.status(500).json({
      erro: "Erro ao buscar resumo da carteira de investimentos.",
      detalhe: err.message,
    });
  }
}

module.exports = { resumoCarteira };
