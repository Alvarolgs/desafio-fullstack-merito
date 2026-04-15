import { useEffect, useState, useCallback } from "react";
import { movimentacoesApi, fundosApi } from "../services/api";
import { formatCurrency, formatDate, formatNumber } from "../utils/formatters";
import MovimentacaoModal from "../components/MovimentacaoModal";

export default function Movimentacoes() {
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [fundos, setFundos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const [filtroFundo, setFiltroFundo] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("");
  const [filtroDataInicio, setFiltroDataInicio] = useState("");
  const [filtroDataFim, setFiltroDataFim] = useState("");

  function showSucesso(msg) {
    setSucesso(msg);
    setTimeout(() => setSucesso(""), 3000);
  }

  const loadPage = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filtroFundo) params.fundo_id = filtroFundo;
      if (filtroTipo) params.tipo = filtroTipo;
      if (filtroDataInicio) params.data_inicio = filtroDataInicio;
      if (filtroDataFim) params.data_fim = filtroDataFim;

      const data = await movimentacoesApi.listar(params);
      setMovimentacoes(data);
    } catch {
      setErro("Erro ao carregar movimentações.");
    } finally {
      setLoading(false);
    }
  }, [filtroFundo, filtroTipo, filtroDataInicio, filtroDataFim]);

  useEffect(() => {
    loadPage();
  }, [loadPage]);

  useEffect(() => {
    fundosApi.listar().then(setFundos);
  }, []);

  async function handleSave(form) {
    await movimentacoesApi.registrar(form);
    showSucesso("Movimentação registrada com sucesso!");
    setModal(false);
    loadPage();
  }

  async function handleDeletar(id) {
    if (
      !window.confirm(
        "Tem certeza que deseja remover esta movimentação? O saldo da carteira será revertido.",
      )
    )
      return;
    try {
      await movimentacoesApi.deletar(id);
      showSucesso("Movimentação removida.");
      loadPage();
    } catch (err) {
      setErro(err.message);
    }
  }

  function limparFiltros() {
    setFiltroFundo("");
    setFiltroTipo("");
    setFiltroDataInicio("");
    setFiltroDataFim("");
  }

  const totalAportes = movimentacoes
    .filter((m) => m.tipo === "aporte")
    .reduce((acc, m) => acc + m.valor, 0);
  const totalResgates = movimentacoes
    .filter((m) => m.tipo === "resgate")
    .reduce((acc, m) => acc + m.valor, 0);

  return (
    <div className="page">
      <h1 className="page-title">Movimentações</h1>

      {erro && <div className="alert alert-error">{erro}</div>}
      {sucesso && <div className="alert alert-success">{sucesso}</div>}

      <div className="card mb-16">
        <div className="section-title" style={{ marginBottom: 14 }}>
          Filtros
        </div>
        <div className="form-grid">
          <div className="form-group">
            <label>Fundo</label>
            <select
              value={filtroFundo}
              onChange={(e) => setFiltroFundo(e.target.value)}
            >
              <option value="">Todos</option>
              {fundos.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.nome} ({f.ticker})
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Tipo</label>
            <select
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
            >
              <option value="">Todos</option>
              <option value="aporte">Aporte</option>
              <option value="resgate">Resgate</option>
            </select>
          </div>
          <div className="form-group">
            <label>Data Início</label>
            <input
              type="date"
              value={filtroDataInicio}
              onChange={(e) => setFiltroDataInicio(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Data Fim</label>
            <input
              type="date"
              value={filtroDataFim}
              onChange={(e) => setFiltroDataFim(e.target.value)}
            />
          </div>
        </div>
        <div style={{ marginTop: 12 }}>
          <button className="btn btn-ghost" onClick={limparFiltros}>
            Limpar Filtros
          </button>
        </div>
      </div>

      {movimentacoes.length > 0 && (
        <div className="cards-grid mb-16">
          <div className="card">
            <div className="stat-label">Total de Aportes</div>
            <div className="stat-value green">
              {formatCurrency(totalAportes)}
            </div>
          </div>
          <div className="card">
            <div className="stat-label">Total de Resgates</div>
            <div className="stat-value" style={{ color: "var(--red)" }}>
              {formatCurrency(totalResgates)}
            </div>
          </div>
          <div className="card">
            <div className="stat-label">Saldo Líquido</div>
            <div
              className={`stat-value ${totalAportes - totalResgates >= 0 ? "green" : ""}`}
            >
              {formatCurrency(totalAportes - totalResgates)}
            </div>
          </div>
        </div>
      )}

      <div className="card">
        <div className="section-header">
          <span className="section-title">
            Histórico ({movimentacoes.length})
          </span>
          <button className="btn btn-primary" onClick={() => setModal(true)}>
            Nova Movimentação
          </button>
        </div>

        {loading ? (
          <div className="loading">Carregando...</div>
        ) : movimentacoes.length === 0 ? (
          <div className="empty-state">
            <div>📋</div>
            <p>Nenhuma movimentação encontrada.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Fundo</th>
                  <th>Ticker</th>
                  <th>Tipo</th>
                  <th className="text-right">Valor</th>
                  <th className="text-right">Cotas</th>
                  <th>Observação</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {movimentacoes.map((m) => (
                  <tr key={m.id}>
                    <td>{formatDate(m.data)}</td>
                    <td>{m.fundo_nome}</td>
                    <td>
                      <span className="badge badge-blue">{m.fundo_ticker}</span>
                    </td>
                    <td>
                      <span
                        className={`badge ${m.tipo === "aporte" ? "badge-green" : "badge-red"}`}
                      >
                        {m.tipo === "aporte" ? "Aporte" : "Resgate"}
                      </span>
                    </td>
                    <td
                      className={`text-right ${m.tipo === "aporte" ? "text-green" : "text-red"}`}
                    >
                      {m.tipo === "resgate" ? "-" : "+"}
                      {formatCurrency(m.valor)}
                    </td>
                    <td className="text-right text-muted">
                      {formatNumber(m.quantidade_cotas)}
                    </td>
                    <td className="text-muted">{m.observacao || "-"}</td>
                    <td>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDeletar(m.id)}
                      >
                        Remover
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal && (
        <MovimentacaoModal
          onSave={handleSave}
          onClose={() => setModal(false)}
        />
      )}
    </div>
  );
}
