import { useEffect, useState } from "react";
import { fundosApi } from "../services/api";
import { formatCurrency } from "../utils/formatters";
import FundoModal from "../components/FundoModal";

const TIPO_BADGE = {
  "Renda Fixa": "badge-blue",
  "Renda Variável": "badge-yellow",
  Multimercado: "badge-blue",
  FII: "badge-green",
  Ações: "badge-yellow",
  Exterior: "badge-blue",
};

export default function Fundos() {
  const [fundos, setFundos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // null | 'novo' | fundo
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  function showSucesso(message) {
    setSucesso(message);
    setTimeout(() => setSucesso(""), 3000);
  }

  async function loadPage() {
    try {
      const data = await fundosApi.listar();
      setFundos(data);
    } catch {
      setErro("Erro ao carregar fundos.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPage();
  }, []);

  async function handleSave(form) {
    if (modal && modal !== "novo") {
      await fundosApi.atualizar(modal.id, form);
      showSucesso("Fundo atualizado com sucesso!");
    } else {
      await fundosApi.criar(form);
      showSucesso("Fundo criado com sucesso!");
    }
    setModal(null);
    loadPage();
  }

  async function handleDeletar(fundo) {
    if (
      !window.confirm(
        `Tem certeza que deseja remover o fundo "${fundo.nome}"? As movimentações vinculadas também serão removidas.`,
      )
    )
      return;
    try {
      await fundosApi.deletar(fundo.id);
      showSucesso("Fundo removido.");
      loadPage();
    } catch (err) {
      setErro(err.message);
    }
  }

  return (
    <div className="page">
      <h1 className="page-title">Fundos de Investimento</h1>

      {erro && <div className="alert alert-error">{erro}</div>}
      {sucesso && <div className="alert alert-success">{sucesso}</div>}

      <div className="card">
        <div className="section-header">
          <span className="section-title">
            Todos os Fundos ({fundos.length})
          </span>
          <button className="btn btn-primary" onClick={() => setModal("novo")}>
            Novo Fundo
          </button>
        </div>

        {loading ? (
          <div className="loading">Carregando...</div>
        ) : fundos.length === 0 ? (
          <div className="empty-state">
            <div>📁</div>
            <p>Nenhum fundo cadastrado ainda.</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Ticker</th>
                  <th>Tipo</th>
                  <th className="text-right">Valor da Cota</th>
                  <th className="text-right">Saldo na Carteira</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {fundos.map((f) => (
                  <tr key={f.id}>
                    <td>{f.nome}</td>
                    <td>
                      <span className="badge badge-blue">{f.ticker}</span>
                    </td>
                    <td>
                      <span
                        className={`badge ${TIPO_BADGE[f.tipo] || "badge-blue"}`}
                      >
                        {f.tipo}
                      </span>
                    </td>
                    <td className="text-right">
                      {formatCurrency(f.valor_cota)}
                    </td>
                    <td className="text-right text-green">
                      {formatCurrency(f.saldo_investido)}
                    </td>
                    <td className="text-right" style={{ whiteSpace: "nowrap" }}>
                      <button
                        className="btn btn-ghost"
                        style={{ marginRight: 6 }}
                        onClick={() => setModal(f)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDeletar(f)}
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
        <FundoModal
          fundo={modal !== "novo" ? modal : null}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
