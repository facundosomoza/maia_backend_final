const express = require("express");
const connection = require("../connection");

const router = express.Router();

router.post("/", (req, res) => {
  console.log(req.body);

  const { firstName, lastName, email, subject, message } = req.body;

  const values = [firstName, lastName, subject, message, email];

  const sqlInsertContact = `INSERT INTO form_contact(name, surname, subject, message, email)
                            VALUES(?, ?, ?, ?, ?)`;

  connection.query(sqlInsertContact, values, (error, result) => {
    if (error) {
      res.json({ message: "Error al registrar el mensaje" });
    } else {
      res.json({ message: "Mensaje registrado correctamente" });
    }
  });
});

module.exports = router;
