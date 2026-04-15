function errorHandler(err, req, res, next) {
  console.error('❌ Erro não tratado:', err);
  return res.status(500).json({ erro: 'Erro interno do servidor.', detalhe: err.message });
}

module.exports = { errorHandler };
