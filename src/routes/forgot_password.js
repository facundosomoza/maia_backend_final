const express = require("express");
const connection = require("../connection");

const router = express.Router();
/*
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");

require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "noreply_maiatsadze@gmail.com", // Tu dirección de correo electrónico de Gmail
    pass: process.env.GMAIL_PASSWORD, // Obtener la contraseña de la variable de entorno
  },
});
*/
router.post("/forgot_password", (req, res) => {
  /*
  const { email } = req.body;

  // Generar un token único para el restablecimiento de contraseña
  const token = uuidv4();

  // Crear el enlace de restablecimiento de contraseña con el token
  const resetPasswordLink = `https://tudominio.com/reset_password?token=${token}`;

  // Configurar el correo electrónico
  const mailOptions = {
    from: "noreply_maiatsadze@gmail.com",
    to: email,
    subject: "Password Reset", // Subject line
    html: `
    <p>Hello,</p>
    <p>We have received a request to reset your password.</p>
    <p>Please click on the following link to reset your password:</p>
    <a href="${resetPasswordLink}">Reset Password</a>
    <p>If you did not request a password reset, please ignore this email.</p>
  `,
  };

  // Enviar el correo electrónico
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res
        .status(500)
        .json({ message: "Error al enviar el correo electrónico" });
    } else {
      console.log("Correo electrónico enviado: " + info.response);
      res.json({ message: "Correo electrónico enviado correctamente" });
    }
  });
  */
});

module.exports = router;
