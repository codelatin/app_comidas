const express= require("express");
const   {  ControladorRegistro } = require("../controller/usuario");
const router = express.Router();

router.post("/registro", ControladorRegistro);

module.exports= router;