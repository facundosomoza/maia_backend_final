const express = require("express");
const connection = require("../connection");
const sendEmail = require("../utils/mailing");
const emailTypes = require("../utils/email_types");

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
      sendEmail(
        {
          email: "mtsadzeart@gmail.com",
          firstName,
          lastName,
          subject,
          message,
          userEmail: email,
        },
        null,
        emailTypes.FORM_CONTACT,
        "CONTACT"
      );

      sendEmail(
        {
          email,
          firstName,
          lastName,
          message,
        },
        null,
        emailTypes.FORM_CONTACT_FOR_USER,
        "CONTACT CONFIRMATION"
      );

      res.json({ message: "Mensaje registrado correctamente" });
    }
  });
});

module.exports = router;
