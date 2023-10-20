const express = require("express");
const connection = require("../connection");

const router = express.Router();

router.get("/email-confirmed", (req, res) => {
  const token = req.query.token;

  console.log({ token });

  const confirmRegisterHashSql = `SELECT *
                                  FROM users
                                  WHERE hash = ?`;

  const sqlValues = [token];

  connection.query(
    confirmRegisterHashSql,
    sqlValues,
    (error, resultConfirmRegisterHash) => {
      if (error) {
        res.status(500).json({ message: "Error validanting Token." });
      } else {
        if (resultConfirmRegisterHash.length === 1) {
          //Token confirmado!
          const emailUser = resultConfirmRegisterHash[0].email;

          //Activo el user en la BD
          const activateUserSql = `UPDATE users
                                 SET hash = ?,
                                     active = ?
                                 WHERE hash = ?`;

          const sqlValues = ["", 1, token];

          connection.query(
            activateUserSql,
            sqlValues,
            (error, resultActivateUser) => {
              if (error) {
                res.status(500).json({ message: "Error validanting Token." });
              } else {
                console.log({ resultActivateUser });

                res.redirect(
                  `http://localhost:3000/email-confirmation-success?token=${token}&user=${emailUser}`
                );
              }
            }
          );
        } else {
          res.status(404).json({ message: "Token is not valid." });
        }
      }
    }
  );
});

module.exports = router;
