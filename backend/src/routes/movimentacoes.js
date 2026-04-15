const express = require("express");
const router = express.Router();
const {
  listarMovimentacoes,
  registrarMovimentacao,
  deletarMovimentacao,
} = require("../controllers/movimentacoesController");

router.get("/", listarMovimentacoes);
router.post("/", registrarMovimentacao);
router.delete("/:id", deletarMovimentacao);

module.exports = router;
