const express = require("express");
const connection = require("../connection");

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
        const sql = `INSERT INTO users(email, password)
        VALUES(?,?)`;

        const values = [email, password];

        connection.query(sql, values, (error, result) => {
          if (error) {
            console.log(error.message);
            res.json({ message: "error to create the user" });
          } else {
            const newId = result.insertId;

            req.session.user = { email, userId: newId };

            res.json(result);
          }
        });
      }
    }
  });
});

module.exports = router;
