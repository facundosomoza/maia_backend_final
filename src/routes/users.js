const express = require("express");
const { v4: uuidv4 } = require("uuid");

const connection = require("../connection");
const sendEmail = require("../utils/mailing");

const { EMAIL_REGISTER_CONFIRMATION } = require("../utils/email_types");

const router = express.Router();

router.post("/", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const sql2 = `SELECT * FROM users WHERE email = ?`;

  connection.query(sql2, [email], (error, result) => {
    if (error) {
      console.log(error.message);
      res.json({ message: "error to create the user" });
    } else {
      if (result.length > 0) {
        console.log("email ya existente");
        res.status(500).json({ message: "email already exist" });
      } else {
        const sql = `INSERT INTO users(email, password, active)
        VALUES(?, ?, ?)`;

        const values = [email, password, 0];

        connection.query(sql, values, (error, resultInsert) => {
          if (error) {
            console.log(error.message);
            res.json({ message: "error to create the user" });
          } else {
            const newId = resultInsert.insertId;

            //1- Crear el hash para enviar por email
            const hash = uuidv4();

            console.log({ hash });

            //2- Guardar el hash en la bd

            const sqlSaveactivationHash = `UPDATE users
                                 SET hash = ?
                                 WHERE id = ?`;

            const sqlValues = [hash, newId];

            connection.query(
              sqlSaveactivationHash,
              sqlValues,
              (error, result) => {
                if (error) {
                  console.log("No se pudo guardar el hash");
                } else {
                  const activationHash = `http://localhost:8001/register/email-confirmed?token=${hash}`;

                  //3- Enviar email
                  sendEmail(
                    { activationHash, email },
                    null,
                    EMAIL_REGISTER_CONFIRMATION,
                    "CONFIRM YOUR EMAIL"
                  );

                  //req.session.user = { email, userId: newId };

                  res.json(resultInsert);
                }
              }
            );
          }
        });
      }
    }
  });
});

router.get("/verify_email/:email", (req, res) => {
  const { email } = req.params;

  const sqlVerifyEmail = `SELECT email
                          FROM users
                          WHERE email = ?
                          `;

  const sqlValues = [email];

  connection.query(sqlVerifyEmail, sqlValues, (error, result) => {
    if (error) {
      console.log("Error al verficar el email");
    } else {
      if (result.length === 1) {
        res.status(500).json({ message: "Email already exists" });
      } else {
        res.json({ message: "Email is not in use" });
      }
    }
  });
});

module.exports = router;
