const express = require("express");
const connection = require("../connection");

const router = express.Router();

router.post("/add_to_cart", (req, res) => {
  const idUsuario = req.body.userId;
  const idCuadrosArte = req.body.picture.id;

  console.log(req.body);

  console.log(idUsuario, idCuadrosArte);

  const sql = `INSERT INTO carrito (id_obra_arte, id_usuario)
                VALUES (?, ?)`;

  const values = [idCuadrosArte, idUsuario];

  connection.query(sql, values, (error, result) => {
    if (error) {
      console.log(error.message);
      res.json({ message: "error to get the info" });
    } else {
      res.json(result);
    }
  });
});

router.get("/:userId", (req, res) => {
  const sql = `SELECT *
                 FROM carrito
                 INNER JOIN cuadros_arte
                   ON carrito.id_obra_arte = cuadros_arte.id
                 WHERE carrito.id_usuario = ${req.params.userId}`; //REFACTOR

  connection.query(sql, (error, cartResult) => {
    if (error) {
      res.json({ message: "error to get data" });
    } else {
      console.log("llegue al else");
      let cantQueriesTerminadas = 0;

      if (cartResult.length > 0) {
        cartResult.map((cartItem) => {
          //cartItem.id_obra_arte

          //Tengo que traer las imagenes desde la tabla imagenes_cuadros_arte que correspondan al id resu.id_obra_arte
          const sqlImagenes = `SELECT *
                                FROM imagenes_cuadros_arte
                                WHERE id_cuadros_arte=${cartItem.id_obra_arte}`;

          connection.query(sqlImagenes, (error, result) => {
            if (error) {
              res.json({ message: "error to get the pictures" });
            } else {
              cartItem.imagen = result[0].file_image;
              console.log(cartItem);

              cantQueriesTerminadas++;
              console.log(cantQueriesTerminadas);

              if (cantQueriesTerminadas === cartResult.length) {
                res.json(cartResult);
              }
            }
          });
        });
      } else {
        if (cantQueriesTerminadas === cartResult.length) {
          res.json([]);
        }
      }
    }
  });
});

router.delete("/:idObraArte/:idUsuario", (req, res) => {
  const sql = `DELETE FROM carrito
                WHERE id_obra_arte=${req.params.idObraArte} AND id_usuario=${req.params.idUsuario}`;

  connection.query(sql, (error, result) => {
    if (error) {
      console.log(error.message);
      res.json({ message: "error to delete user" });
    } else {
      res.json(result);
    }
  });
});

module.exports = router;
