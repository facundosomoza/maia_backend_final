const express = require("express");
const connection = require("../connection");

const router = express.Router();

const { v4: uuidv4 } = require("uuid");
const sendEmail = require("../utils/mailing");

const emailTypes = require("../utils/email_types");

/*
const nodemailer = require("nodemailer");

require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "noreply_maiatsadze@gmail.com", // Tu dirección de correo electrónico de Gmail
    pass: process.env.GMAIL_PASSWORD, // Obtener la contraseña de la variable de entorno
  },
});
*/
router.post("/", (req, res) => {
  const { email } = req.body;

  // Generar un token único para el restablecimiento de contraseña
  const token = uuidv4();

  // Crear el enlace de restablecimiento de contraseña con el token
  const resetPasswordLink = `http://localhost:8001/forgot_password/reset?token=${token}`;

  console.log("RESET LINK", email, resetPasswordLink);

  const sql = `UPDATE users
               SET hash = ?
               WHERE email = ?`;

  const sqlValues = [token, email];

  connection.query(sql, sqlValues, (error, result) => {
    if (error) {
      console.log("Error al guardar el token");
    } else {
      if (result.affectedRows === 1) {
        sendEmail(
          { email, resetPasswordLink },
          null,
          emailTypes.PASSWORD_RECOVERY_LINK,
          "RECOVERY PASSWORD"
        );

        res.json({ message: "Email sent" });
      } else {
        res.status(404).json({ message: "Email not exists" });
      }
    }
  });
});

router.get("/reset", (req, res) => {
  const resetToken = req.query.token;

  const sql = `SELECT email
               FROM users
               WHERE hash = ?`;

  const sqlValues = [resetToken];

  connection.query(sql, sqlValues, (error, result) => {
    if (error) {
      console.log("Error al verificar el token");
    } else {
      if (result.length > 0) {
        const emailUser = result[0].email;
        //res.json({ message: "RESET PASSWORD FOR", emailUser });
        res.redirect(
          `http://localhost:3000/reset-password?token=${resetToken}&user=${emailUser}`
        );
      } else {
        res.status(404).json({ message: "EL TOKEN NO ES VALIDO", resetToken });
      }
    }
  });
});

router.put("/change_password", (req, res) => {
  const { recoveryToken, passwordNew } = req.body;

  console.log("Cambiar la password RECOVERy", recoveryToken, passwordNew);

  const sqlPasswordRecovery = `UPDATE users
                               SET password = ?, 
                                   hash = ""
                               WHERE hash = ? `;

  const sqlValues = [passwordNew, recoveryToken];

  connection.query(sqlPasswordRecovery, sqlValues, (error, result) => {
    if (error) {
      console.log("Error");
    } else {
      res.json("Password changed!");
    }
  });
});

module.exports = router;
