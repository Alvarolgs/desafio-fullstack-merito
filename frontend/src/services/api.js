const BASE_URL = process.env.REACT_APP_API_URL || '/api';

async function request(method, path, body) {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (body) options.body = JSON.stringify(body);

  const res = await fetch(`${BASE_URL}${path}`, options);
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.erro || 'Erro na requisição');
  }
  return data;
}

// Fundos
export const fundosApi = {
  listar: () => request('GET', '/fundos'),
  buscar: (id) => request('GET', `/fundos/${id}`),
  criar: (body) => request('POST', '/fundos', body),
  atualizar: (id, body) => request('PUT', `/fundos/${id}`, body),
  deletar: (id) => request('DELETE', `/fundos/${id}`),
};

// Movimentações
export const movimentacoesApi = {
  listar: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request('GET', `/movimentacoes${qs ? '?' + qs : ''}`);
  },
  registrar: (body) => request('POST', '/movimentacoes', body),
  deletar: (id) => request('DELETE', `/movimentacoes/${id}`),
};

// Carteira
export const carteiraApi = {
  resumo: () => request('GET', '/carteira'),
};
