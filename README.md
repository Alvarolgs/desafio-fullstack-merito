# desafio-fullstack-merito

Dashboard de Investimento – Desafio Técnico Mérito

## Tecnologias

- **Backend**: Node.js + Express + better-sqlite3
- **Frontend**: React 18 (Create React App)
- **Banco de dados**: SQLite (arquivo local em `backend/data/`)

---

## Estrutura do Projeto

```
desafio-fullstack-merito/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── carteiraController.js
│   │   │   ├── fundoController.js
│   │   │   └── movimentacoesController.js
│   │   ├── database/
│   │   │   ├── db.js
│   │   │   └── migrations.js
│   │   ├── middlewares/
│   │   │   └── errorHandler.js
│   │   ├── repositories/
│   │   │   ├── carteiraRepositories.js
│   │   │   ├── fundoRepositories.js
│   │   │   └── movimentacaoRepositories.js
│   │   ├── routes/
│   │   │   ├── carteira.js
│   │   │   ├── fundos.js
│   │   │   └── movimentacoes.js
│   │   ├── services/
│   │   │   ├── carteiraService.js
│   │   │   ├── fundoService.js
│   │   │   └── movimentacaoService.js
│   │   └── server.js
│   ├── package-lock.json
│   └── package.json
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── FundoModal.jsx
    │   │   └── MovimentacaoModal.jsx
    │   ├── pages/
    │   │   ├── Dashboard.jsx
    │   │   ├── Fundos.jsx
    │   │   └── Movimentacoes.jsx
    │   ├── services/
    │   │   └── api.js
    │   ├── utils/
    │   │   └── formatters.js
    │   ├── App.jsx
    │   ├── index.js
    │   ├── index.css
    └── package-lock.json
    └── package.json
```

### Responsabilidade de cada camada

| Camada | Responsabilidade |
|---|---|
| **Controller** | Recebe a requisição HTTP, chama o service e devolve a resposta |
| **Service** | Contém todas as regras de negócio |
| **Repository** | Única camada que acessa o banco de dados. Executa queries e retorna dados brutos. |

---

## Como rodar o backend

```bash
cd backend
npm install
npm run dev      # desenvolvimento com nodemon (hot reload)
# ou
npm start        # produção
```

O servidor sobe em **http://localhost:3001**.  
O banco SQLite é criado automaticamente em `backend/database/investimentos.db` na primeira execução.

---

## Como rodar o frontend

```bash
cd frontend
npm install
npm start
```

O React sobe em **http://localhost:3000** e já proxeia as chamadas `/api/*` para o backend na porta 3001.

---

## API RESTful – Endpoints

### Fundos

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/fundos` | Lista todos os fundos |
| GET | `/api/fundos/:id` | Busca fundo por ID |
| POST | `/api/fundos` | Cria novo fundo |
| PUT | `/api/fundos/:id` | Atualiza fundo |
| DELETE | `/api/fundos/:id` | Remove fundo |

### Movimentações

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/movimentacoes` | Lista movimentações (suporta filtros) |
| POST | `/api/movimentacoes` | Registra aporte ou resgate |
| DELETE | `/api/movimentacoes/:id` | Remove movimentação e reverte carteira |

### Carteira

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/carteira` | Resumo da carteira com posições e totais |

---

## Testando no Postman

### Configuração inicial

1. Abra o Postman e crie uma **nova Collection** chamada `Merito Invest`.
2. Crie uma variável de ambiente:
   - **Nome**: `base_url`
   - **Valor**: `http://localhost:3001`
3. Nas requisições, use `{{base_url}}` no lugar do endereço.

---

### Fundos

#### Criar fundo — `POST /api/fundos`

```
POST {{base_url}}/api/fundos
Content-Type: application/json
```

```json
{
  "nome": "Tesouro Selic 2027",
  "ticker": "TSELIC",
  "tipo": "Renda Fixa",
  "valor_cota": 13.57
}
```

Retorno esperado (`201 Created`):
```json
{
  "id": 1,
  "nome": "Tesouro Selic 2027",
  "ticker": "TSELIC",
  "tipo": "Renda Fixa",
  "valor_cota": 13.57,
  "created_at": "2024-05-01 10:00:00",
  "updated_at": "2024-05-01 10:00:00"
}
```

Tipos aceitos: `Renda Fixa`, `Renda Variável`, `Multimercado`, `FII`, `Ações`, `Exterior`

---

#### Atualizar fundo — `PUT /api/fundos/:id`

```
PUT {{base_url}}/api/fundos/1
Content-Type: application/json
```

```json
{
  "valor_cota": 14.20
}
```

> Todos os campos são opcionais no PUT — envie apenas o que deseja alterar.

---

#### Listar todos os fundos — `GET /api/fundos`

```
GET {{base_url}}/api/fundos
```

---

#### Buscar fundo por ID — `GET /api/fundos/:id`

```
GET {{base_url}}/api/fundos/1
```

---

#### Remover fundo — `DELETE /api/fundos/:id`

```
DELETE {{base_url}}/api/fundos/1
```

> Atenção: remover um fundo também remove todas as movimentações vinculadas a ele (cascade).

---

### Movimentações

#### Registrar aporte — `POST /api/movimentacoes`

```
POST {{base_url}}/api/movimentacoes
Content-Type: application/json
```

```json
{
  "fundo_id": 1,
  "tipo": "aporte",
  "valor": 1000.00,
  "data": "2024-05-01",
  "observacao": "Aporte inicial"
}
```

Retorno esperado (`201 Created`):
```json
{
  "id": 1,
  "fundo_id": 1,
  "tipo": "aporte",
  "valor": 1000.00,
  "quantidade_cotas": 73.6919,
  "data": "2024-05-01",
  "observacao": "Aporte inicial",
  "fundo_nome": "Tesouro Selic 2027",
  "fundo_ticker": "TSELIC"
}
```

---

#### Registrar resgate — `POST /api/movimentacoes`

```
POST {{base_url}}/api/movimentacoes
Content-Type: application/json
```

```json
{
  "fundo_id": 1,
  "tipo": "resgate",
  "valor": 300.00,
  "data": "2024-06-15",
  "observacao": "Resgate parcial"
}
```

> O backend valida se há saldo suficiente. Se não houver, retorna `400 Bad Request` com a mensagem `"Saldo insuficiente para realizar o resgate."`.

---

#### Listar todas as movimentações — `GET /api/movimentacoes`

```
GET {{base_url}}/api/movimentacoes
```

---

#### Listar com filtros — `GET /api/movimentacoes`

Todos os filtros são opcionais e combináveis via query string:

```
GET {{base_url}}/api/movimentacoes?fundo_id=1
GET {{base_url}}/api/movimentacoes?tipo=aporte
GET {{base_url}}/api/movimentacoes?data_inicio=2024-01-01&data_fim=2024-12-31
GET {{base_url}}/api/movimentacoes?fundo_id=1&tipo=resgate&data_inicio=2024-06-01
```

No Postman, use a aba **Params** para preencher os filtros sem digitar a query string manualmente.

---

#### Remover movimentação — `DELETE /api/movimentacoes/:id`

```
DELETE {{base_url}}/api/movimentacoes/1
```

> O saldo e a quantidade de cotas na carteira são revertidos automaticamente.

---

### Carteira

#### Resumo da carteira — `GET /api/carteira`

```
GET {{base_url}}/api/carteira
```

Retorno esperado:
```json
{
  "total_investido": 700.00,
  "total_valor_atual": 700.00,
  "posicoes": [
    {
      "fundo_id": 1,
      "nome": "Tesouro Selic 2027",
      "ticker": "TSELIC",
      "tipo": "Renda Fixa",
      "valor_cota": 13.57,
      "quantidade_cotas": 51.5842,
      "saldo_investido": 700.00,
      "valor_atual": 700.00
    }
  ],
  "por_tipo": {
    "Renda Fixa": {
      "saldo_investido": 700.00,
      "valor_atual": 700.00
    }
  }
}
```

---

## 🐳 Docker

### Build da imagem e Rodar Container

```bash
cd backend
docker build -t merito-invest-backend .
docker run -p 3001:3001 merito-invest-backend
```

---

## ⚙️ CI/CD Pipeline

O projeto possui um pipeline configurado utilizando GitHub Actions.

### Etapas do pipeline:

1. **Testes**
   - Instala dependências
   - Executa testes automatizados

2. **Build**
   - Cria imagem Docker do backend
   - Exporta a imagem como artefato

3. **Deploy (simulado)**
   - Carrega a imagem Docker
   - Exibe informações do deploy

O pipeline é executado automaticamente a cada push nas branches `main` e `master`.

---

## Lógica de Negócio

- **Aporte**: incrementa saldo e quantidade de cotas na carteira. A quantidade de cotas é calculada como `valor / valor_cota` do fundo.
- **Resgate**: valida se há saldo suficiente, depois decrementa saldo e cotas. Retorna erro `400` se saldo insuficiente.
- **Remoção de movimentação**: reverte automaticamente o efeito na carteira (transação SQLite).
- Todas as operações de movimentação usam **transações atômicas** no SQLite para garantir consistência.
