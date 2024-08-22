const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const imageRoute = require("./routes/imagen");
const userRoute = require("./routes/usuario");
const cors = require("cors");

dotenv.config();
const app = express();
const port = process.env.PORT || 8000;

// Middlewares
app.use(cors());
app.use(express.json({ limit: "3mb" }));

// Rutas
app.get("/", (req, res) => {
    res.send("Hola Mundo");
});
app.use("/api/v1/all", imageRoute);
app.use("/api/v1/usuario", userRoute);

// Conexión a la Base de Datos

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB);
        console.log("Estoy Conectado");
    } catch (error) {
        console.error("Error al conectarse a la base de datos:", error);
        throw error;
    }
};

mongoose.connection.on("disconnected", () => {
    console.log("Base de datos desconectada");
});

mongoose.connection.on("connected", () => {
    console.log("Base de datos conectada");
});

// Iniciar el Servidor
connect();
app.listen(port, () => {
    console.log(`Servidor ejecutándose desde el puerto ${port}`);
});

// Manejo de Errores (opcional, pero recomendado)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Algo salió mal!");
});
