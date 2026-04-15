const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const { runMigrations } = require('./database/migrations');
const fundosRoutes = require('./routes/fundos');
const movimentacoesRoutes = require('./routes/movimentacoes');
const carteiraRoutes = require('./routes/carteira');
const { errorHandler } = require('./middlewares/errorHandler');

runMigrations();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/fundos', fundosRoutes);
app.use('/api/movimentacoes', movimentacoesRoutes);
app.use('/api/carteira', carteiraRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Backend rodando em http://localhost:${PORT}`);
  console.log(`API disponível em http://localhost:${PORT}/api`);
});
