const carteiraRepository = require("../repositories/carteiraRepositories");

function getResumoCarteira() {
  const posicoes = carteiraRepository.findPosicoesComFundos();

  const totalInvestido = posicoes.reduce(
    (acc, p) => acc + p.saldo_investido,
    0,
  );
  const totalAtual = posicoes.reduce((acc, p) => acc + p.valor_atual, 0);

  const porTipo = posicoes.reduce((acc, p) => {
    if (!acc[p.tipo]) acc[p.tipo] = { saldo_investido: 0, valor_atual: 0 };
    acc[p.tipo].saldo_investido += p.saldo_investido;
    acc[p.tipo].valor_atual += p.valor_atual;
    return acc;
  }, {});

  return {
    total_investido: totalInvestido,
    total_valor_atual: totalAtual,
    posicoes,
    por_tipo: porTipo,
  };
}

module.exports = { getResumoCarteira };
