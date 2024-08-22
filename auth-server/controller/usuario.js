const bcrypt= require("bcrypt");
const jwt=require("jsonwebtoken");
const Usuario= require("../model/Usuario");
const Generadorotp= require("otp-generator");
const nodemailer=require("nodemailer");
const ControladorRegistro = async (req, res) => {
    try {
        // Validar si se proporciona el campo Imagenperfil
        const { nombre, email, password, confirmarpassword, Imagenperfil } = req.body;
        if (!Imagenperfil) {
            return res.status(400).send({
                message: "El campo Imagenperfil es requerido.",
                success: false,
            });
        }

        // Verificar si el usuario ya existe
        const ExisteUsuario = await Usuario.findOne({ email });
        if (ExisteUsuario) {
            return res.status(200).send({
                message: "Ups este Usuario Ya existe",
                success: false,
            });
        }

        // Encriptar la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashpassword = await bcrypt.hash(password, salt);
        req.body.password = hashpassword;
        const confirmarPassword = await bcrypt.hash(confirmarpassword, salt);

        // Generar OTP
        const otp = Generadorotp.generate(6, {
            digits: true,
            upperCase: false,
            specialChars: false,
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
        });
        req.body.confirmarpassword = confirmarPassword;

        // Verificar si las contraseñas coinciden
        if (req.body.password === req.body.confirmarpassword) {
            // Crear un nuevo usuario
            const NuevoUsuario = new Usuario({
                nombre,
                email,
                Imagenperfil,
                password: req.body.password,
                confirmarpassword: req.body.confirmarpassword,
                otp,
            });
            await NuevoUsuario.save();

            // Verificar JWT_SECRET
            if (!process.env.JWT_SECRET) {
                throw new Error("JWT_SECRET no está definido en las variables de entorno.");
            }

            // Generar token JWT
            const token = jwt.sign({ id: NuevoUsuario._id }, process.env.JWT_SECRET, {
                expiresIn: "1d",
            });

            // Configurar el transporte de nodemailer
            const transportador = nodemailer.createTransport({
                service: "Gmail",
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                }
            });

            // Configurar las opciones del correo electrónico
            const opcionesEmail = {
                from: "App Delivery Codelatin-Colombia",
                to: email,
                subject: "Verificación De Email Por Otp",
                text: `Tu verificación OTP es ${otp}`,
            };

            // Enviar el correo electrónico
            transportador.sendMail(opcionesEmail, (error, info) => {
                if (error) {
                    console.log(error);
                    return res.status(500).json({
                        message: "Error al Enviar Email!...",
                        success: false,
                    });
                } else {
                    return res.status(200).json({
                        message: "El OTP se ha enviado al Email",
                        success: true,
                    });
                }
            });

            // Responder con éxito
            return res.status(201).send({
                message: "Te has Registrado Con Éxito!",
                data: {
                    user: NuevoUsuario,
                    token,
                },
                success: true,
            });
        } else {
            return res.status(400).send({
                message: "Las Contraseñas no Coinciden!",
                success: false,
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: "Error al Registrarse",
            success: false,
        });
    }
};
module.exports = {  ControladorRegistro };