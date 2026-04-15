import { useEffect, useState } from 'react';
import { carteiraApi } from '../services/api';
import { formatCurrency, formatNumber } from '../utils/formatters';

const TIPO_BADGE = {
  'Renda Fixa': 'badge-blue',
  'Renda Variável': 'badge-yellow',
  'Multimercado': 'badge-blue',
  'FII': 'badge-green',
  'Ações': 'badge-yellow',
  'Exterior': 'badge-blue',
};

export default function Dashboard() {
  const [carteira, setCarteira] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    carteiraApi.resumo()
      .then(setCarteira)
      .catch(() => setErro('Erro ao carregar carteira.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Carregando...</div>;
  if (erro) return <div className="alert alert-error">{erro}</div>;

  const { total_investido, posicoes, por_tipo } = carteira;

  return (
    <div className="page">
      <h1 className="page-title">Dashboard</h1>

      <div className="cards-grid">
        <div className="card">
          <div className="stat-label">Total Investido</div>
          <div className="stat-value accent">{formatCurrency(total_investido)}</div>
        </div>
        <div className="card">
          <div className="stat-label">Nº de Fundos</div>
          <div className="stat-value">{posicoes.length}</div>
        </div>
        {Object.entries(por_tipo).map(([tipo, vals]) => (
          <div className="card" key={tipo}>
            <div className="stat-label">{tipo}</div>
            <div className="stat-value green">{formatCurrency(vals.saldo_investido)}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="section-header">
          <span className="section-title">Posições na Carteira</span>
        </div>

        {posicoes.length === 0 ? (
          <div className="empty-state">
            <div>📊</div>
            <p>Nenhuma posição ainda. Registre aportes para começar.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Fundo</th>
                  <th>Ticker</th>
                  <th>Tipo</th>
                  <th className="text-right">Cotas</th>
                  <th className="text-right">Valor da Cota</th>
                  <th className="text-right">Saldo Investido</th>
                </tr>
              </thead>
              <tbody>
                {posicoes.map((p) => (
                  <tr key={p.fundo_id}>
                    <td>{p.nome}</td>
                    <td><span className="badge badge-blue">{p.ticker}</span></td>
                    <td><span className={`badge ${TIPO_BADGE[p.tipo] || 'badge-blue'}`}>{p.tipo}</span></td>
                    <td className="text-right">{formatNumber(p.quantidade_cotas)}</td>
                    <td className="text-right">{formatCurrency(p.valor_cota)}</td>
                    <td className="text-right text-green">{formatCurrency(p.saldo_investido)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
