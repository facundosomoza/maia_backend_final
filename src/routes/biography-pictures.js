const express = require("express");
const connection = require("../connection");
const fs = require("fs");
const path = require("path");

const router = express.Router();

router.post("/", (req, res) => {
  const imageFile = req.files.image;
  const position = req.body.position;

  if (!imageFile) {
    res.status(400).json({ error: "No se proporcionó ninguna imagen" });
    return;
  }

  const ext = path.extname(imageFile.name);
  const fileName = position + ext;

  imageFile.mv(`./public/images/biography/${fileName}`, (error) => {
    if (error) {
      res.status(500).json({ error: "Error al subir la imagen" });
    } else {
      const sqlUpdateImage = `UPDATE biography_pictures
                              SET image = '${fileName}'
                              WHERE position = ${position}`;

      connection.query(sqlUpdateImage, (error, result) => {
        if (error) {
          res
            .status(500)
            .json({ error: "Error al guardar la imagen en la base de datos" });
        } else {
          res.json({ message: "Imagen de la biografía subida correctamente" });
        }
      });
    }
  });
});

router.get("/", (req, res) => {
  const sqlSelectImages = `SELECT *
                            FROM biography_pictures
                            ORDER BY position`;

  connection.query(sqlSelectImages, (error, results) => {
    if (error) {
      res
        .status(500)
        .json({ error: "Error al obtener las imágenes de la biografía" });
    } else {
      res.json(results);
    }
  });
});

module.exports = router;
