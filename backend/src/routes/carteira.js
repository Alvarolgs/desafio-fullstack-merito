const express = require("express");
const router = express.Router();

const carteiraController = require("../controllers/carteiraController");

router.get("/", carteiraController.resumoCarteira);

module.exports = router;
