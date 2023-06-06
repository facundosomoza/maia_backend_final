const express = require("express");
const connection = require("../connection");

const router = express.Router();

router.delete("/logout", (req, res) => {
  console.log("log out carried out");

  req.session.destroy((error) => {
    if (error) {
      res.status(500).json({ message: "Error al cerrar la sesion" });
    } else {
      res.json({ message: "Sesion cerrada correctamente" });
    }
  });
});

router.get("/check_logged", (req, res) => {
  console.log("Check logged", req.session);

  if (req.session.user) {
    res.json(req.session.user);
  } else {
    res.status(401).json({ message: "El usuario no ha iniciado sesion" });
  }
});

router.post("/", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const sql = `SELECT *
                FROM users
                WHERE email=? AND password=?`;

  const values = [email, password];

  connection.query(sql, values, (error, result) => {
    if (error) {
      res.status(500).json({ message: "error to login" });
    } else {
      if (result.length === 1) {
        const userId = result[0].id;

        console.log(req.session);

        req.session.user = { email, userId };

        res
          .status(200)
          .json({ message: "The user and password are valids", userId });
      } else {
        res
          .status(401)
          .json({ message: "The user and password are not valids" });
      }
    }
  });
});

module.exports = router;
