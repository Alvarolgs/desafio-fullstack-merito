import { useState, useEffect } from 'react';

const TIPOS = ['Renda Fixa', 'Renda Variável', 'Multimercado', 'FII', 'Ações', 'Exterior'];

export default function FundoModal({ fundo, onSave, onClose }) {
  const [form, setForm] = useState({
    nome: '',
    ticker: '',
    tipo: 'Renda Fixa',
    valor_cota: '',
  });
  const [erro, setErro] = useState('');
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (fundo) {
      setForm({
        nome: fundo.nome,
        ticker: fundo.ticker,
        tipo: fundo.tipo,
        valor_cota: fundo.valor_cota,
      });
    }
  }, [fundo]);

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    if (!form.nome || !form.ticker || !form.valor_cota) {
      setErro('Preencha todos os campos obrigatórios.');
      return;
    }
    setSalvando(true);
    try {
      await onSave({ ...form, valor_cota: parseFloat(form.valor_cota) });
    } catch (err) {
      setErro(err.message);
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-title">{fundo ? 'Editar Fundo' : 'Novo Fundo'}</div>

        {erro && <div className="alert alert-error">{erro}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group" style={{ gridColumn: '1/-1' }}>
              <label>Nome *</label>
              <input name="nome" value={form.nome} onChange={handleChange} placeholder="Ex: Tesouro Selic 2027" />
            </div>
            <div className="form-group">
              <label>Ticker *</label>
              <input name="ticker" value={form.ticker} onChange={handleChange} placeholder="Ex: TSELIC" style={{ textTransform: 'uppercase' }} />
            </div>
            <div className="form-group">
              <label>Tipo *</label>
              <select name="tipo" value={form.tipo} onChange={handleChange}>
                {TIPOS.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Valor da Cota (R$) *</label>
              <input name="valor_cota" type="number" step="0.01" min="0.01" value={form.valor_cota} onChange={handleChange} placeholder="0,00" />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-primary" disabled={salvando}>
              {salvando ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
