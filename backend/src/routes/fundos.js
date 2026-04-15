const express = require("express");
const router = express.Router();
const {
  listarFundos,
  buscarFundo,
  criarFundo,
  atualizarFundo,
  deletarFundo,
} = require("../controllers/fundoController");

router.get("/", listarFundos);
router.get("/:id", buscarFundo);
router.post("/", criarFundo);
router.put("/:id", atualizarFundo);
router.delete("/:id", deletarFundo);

module.exports = router;
