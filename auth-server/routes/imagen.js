const express= require("express");
const ExpressFormidable= require("express-formidable");
const multer = require("multer");
const { ControladorSubirImagen } = require("../controller/SubirImagen");
const router=express.Router();

router.post("/upload-image",ExpressFormidable({maxFieldsSize:5*2024*2024}),ControladorSubirImagen);



module.exports=router;