const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const UsuarioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [validator.isEmail, "Por favor Indica Un Correo Electronico!"]
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        select: false,
    },
    confirmarpassword: {
        type: String,
        required: true,
        minlength: 8,
        select: false,
        validate: {
            validator: function (evento) {
                return evento === this.password;
            },
            message: "Las Contraseñas No Coinciden",
        },
    },
    estaVerificada: {
        type: Boolean,
        default: false,
        select: false,
    },
    otp: {
        type: Number,
    },
    rol: {
        type: String,
        enum: ["usuario", "admin"],
        default: "usuario",
    },
    Imagenperfil: {
        type: String,
        required: true,
    },
}, {
    timestamps: true
});

// Middleware para encriptar la contraseña antes de guardar esto lo desarolle para mas seguridad
/*UsuarioSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    this.confirmarpassword = undefined; // No almacenar confirmarpassword
    next();
});*/

module.exports = mongoose.model('Usuario', UsuarioSchema);
