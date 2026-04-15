const fundoRepository = require("../repositories/fundoRepositories");

const TIPOS_VALIDOS = [
  "Renda Fixa",
  "Renda Variável",
  "Multimercado",
  "FII",
  "Ações",
  "Exterior",
];

function getAllFundos() {
  return fundoRepository.findAllWithCarteira();
}

function getByIdFundo(id) {
  const fundo = fundoRepository.findByIdWithCarteira(id);
  if (!fundo) throw { status: 404, mensagem: "Fundo não encontrado." };
  return fundo;
}

function createFundo({ nome, ticker, tipo, valor_cota }) {
  if (!nome || !ticker || !tipo || !valor_cota) {
    throw {
      status: 400,
      mensagem: "Campos obrigatórios: nome, ticker, tipo, valor_cota.",
    };
  }

  if (valor_cota <= 0) {
    throw { status: 400, mensagem: "O valor da cota deve ser maior que zero." };
  }

  if (!TIPOS_VALIDOS.includes(tipo)) {
    throw {
      status: 400,
      mensagem: `Tipo inválido. Valores aceitos: ${TIPOS_VALIDOS.join(", ")}.`,
    };
  }

  const tickerFormatado = ticker.toUpperCase().trim();

  if (fundoRepository.findByTicker(tickerFormatado)) {
    throw { status: 409, mensagem: "Já existe um fundo com esse ticker." };
  }

  const resultado = fundoRepository.insertFundo(
    nome.trim(),
    tickerFormatado,
    tipo,
    parseFloat(valor_cota),
  );

  return fundoRepository.findById(resultado.lastInsertRowid);
}

function updateFundo(id, { nome, ticker, tipo, valor_cota }) {
  if (!fundoRepository.findById(id)) {
    throw { status: 404, mensagem: "Fundo não encontrado." };
  }

  if (ticker) {
    const tickerFormatado = ticker.toUpperCase().trim();
    if (fundoRepository.findByTickerExcludingId(tickerFormatado, id)) {
      throw { status: 409, mensagem: "Já existe outro fundo com esse ticker." };
    }
  }

  if (tipo && !TIPOS_VALIDOS.includes(tipo)) {
    throw {
      status: 400,
      mensagem: `Tipo inválido. Valores aceitos: ${TIPOS_VALIDOS.join(", ")}.`,
    };
  }

  fundoRepository.updateFundo({
    nome: nome ? nome.trim() : null,
    ticker: ticker ? ticker.toUpperCase().trim() : null,
    tipo: tipo || null,
    valor_cota: valor_cota ? parseFloat(valor_cota) : null,
    id,
  });

  return fundoRepository.findById(id);
}

function deleteFundo(id) {
  if (!fundoRepository.findById(id)) {
    throw { status: 404, mensagem: "Fundo não encontrado." };
  }

  fundoRepository.deleteFundo(id);
}

module.exports = {
  getAllFundos,
  getByIdFundo,
  createFundo,
  updateFundo,
  deleteFundo,
};
