const express = require("express");
const connection = require("../connection");
const fs = require("fs");
const path = require("path");

const router = express.Router();

router.post("/", (req, res) => {
  console.log("Llegue...");

  //Mover la imagen a la carpeta public/profile
  const backgroundPicture = req.files.image;

  const ext = path.extname(backgroundPicture.name);
  const fileName = Date.now() + ext;

  backgroundPicture.mv(`./public/images/profile/${fileName}`);

  //Desactivo la imagen actual
  const sqlResetActive = `UPDATE admin_pictures
  SET active = 0
  WHERE active = 1`;

  connection.query(sqlResetActive, (error, result) => {
    if (error) {
      res.json({ message: "Error al cambiar la imagen" });
    } else {
      //Guardar en la base de datos el nombre con el que se subio la imagen

      const sqlInsertProfileImage = `INSERT INTO admin_pictures(image)
                                     VALUES( '${fileName}' )`;

      connection.query(sqlInsertProfileImage, (error, result) => {
        if (error) {
          res.json({ message: "Error al cambiar la imagen" });
        } else {
          res.json({ message: "Imagen cambiada correctamente" });
        }
      });
    }
  });
});

router.get("/active-background", (req, res) => {
  const sqlActiveBackground = `SELECT image
                               FROM admin_pictures
                               WHERE active = 1`;

  connection.query(sqlActiveBackground, (error, result) => {
    if (error) {
      res.json({ message: "Error al obtener la imagen de fondo" });
    } else {
      if (result.length > 0) {
        res.json(result[0]);
      } else {
        res.json(null);
      }
    }
  });
});

module.exports = router;
