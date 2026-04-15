import { useState, useEffect } from "react";
import { fundosApi } from "../services/api";
import { todayISO } from "../utils/formatters";

export default function MovimentacaoModal({ onSave, onClose }) {
  const [fundos, setFundos] = useState([]);
  const [form, setForm] = useState({
    fundo_id: "",
    tipo: "aporte",
    valor: "",
    data: todayISO(),
    observacao: "",
  });
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    fundosApi.listar().then((data) => {
      setFundos(data);
      if (data.length > 0) setForm((f) => ({ ...f, fundo_id: data[0].id }));
    });
  }, []);

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    if (!form.fundo_id || !form.valor || !form.data) {
      setErro("Preencha todos os campos obrigatórios.");
      return;
    }
    setSalvando(true);
    try {
      await onSave({
        ...form,
        valor: parseFloat(form.valor),
        fundo_id: parseInt(form.fundo_id),
      });
    } catch (err) {
      setErro(err.message);
    } finally {
      setSalvando(false);
    }
  }

  const fundoSelecionado = fundos.find((f) => f.id === parseInt(form.fundo_id));

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-title">Nova Movimentação</div>

        {erro && <div className="alert alert-error">{erro}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group" style={{ gridColumn: "1/-1" }}>
              <label>Fundo *</label>
              <select
                name="fundo_id"
                value={form.fundo_id}
                onChange={handleChange}
              >
                {fundos.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.nome} ({f.ticker})
                  </option>
                ))}
              </select>
            </div>

            {fundoSelecionado && (
              <div className="form-group" style={{ gridColumn: "1/-1" }}>
                <div
                  style={{
                    fontSize: 12,
                    color: "var(--text-muted)",
                    background: "var(--surface2)",
                    padding: "8px 12px",
                    borderRadius: 6,
                  }}
                >
                  Valor da cota:{" "}
                  <strong style={{ color: "var(--accent)" }}>
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(fundoSelecionado.valor_cota)}
                  </strong>
                  {" · "}Saldo atual:{" "}
                  <strong style={{ color: "var(--green)" }}>
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(fundoSelecionado.saldo_investido)}
                  </strong>
                </div>
              </div>
            )}

            <div className="form-group">
              <label>Tipo *</label>
              <select name="tipo" value={form.tipo} onChange={handleChange}>
                <option value="aporte">Aporte</option>
                <option value="resgate">Resgate</option>
              </select>
            </div>

            <div className="form-group">
              <label>Valor (R$) *</label>
              <input
                name="valor"
                type="number"
                step="0.01"
                min="0.01"
                value={form.valor}
                onChange={handleChange}
                placeholder="0,00"
              />
            </div>

            {form.valor && fundoSelecionado && (
              <div className="form-group" style={{ gridColumn: "1/-1" }}>
                <div
                  style={{
                    fontSize: 12,
                    color: "var(--text-muted)",
                    background: "var(--surface2)",
                    padding: "8px 12px",
                    borderRadius: 6,
                  }}
                >
                  Cotas a {form.tipo === "aporte" ? "incluir" : "resgatar"}:{" "}
                  <strong style={{ color: "var(--text)" }}>
                    {(
                      parseFloat(form.valor || 0) / fundoSelecionado.valor_cota
                    ).toFixed(4)}
                  </strong>
                </div>
              </div>
            )}

            <div className="form-group">
              <label>Data *</label>
              <input
                name="data"
                type="date"
                value={form.data}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Observação</label>
              <input
                name="observacao"
                value={form.observacao}
                onChange={handleChange}
                placeholder="Opcional"
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={salvando}
            >
              {salvando ? "Registrando..." : "Registrar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
