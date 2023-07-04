const express = require("express");
const connection = require("../connection");

const router = express.Router();

// Ruta para obtener los detalles de la imagen de perfil
router.get("/:id", (req, res) => {
  const { id } = req.params;

  // Obtiene los detalles de la imagen en la tabla admin_pictures
  const query = "SELECT * FROM admin_pictures WHERE id = ?";
  connection.query(query, [id], (error, results) => {
    if (error) {
      console.error("Error al obtener los detalles de la imagen:", error);
      res.sendStatus(500);
    } else {
      if (results.length > 0) {
        const imageDetails = results[0];
        res.status(200).json(imageDetails);
      } else {
        res.sendStatus(404); // Imagen no encontrada
      }
    }
  });
});
// Ruta para actualizar la imagen de perfil
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { image } = req.body;

  // Actualiza la imagen en la tabla admin_pictures
  const query = "UPDATE admin_pictures SET image = ? WHERE id = ?";
  connection.query(query, [image, id], (error, results) => {
    if (error) {
      console.error("Error al actualizar la imagen:", error);
      res.sendStatus(500);
    } else {
      res.sendStatus(200);
    }
  });
});

module.exports = router;
