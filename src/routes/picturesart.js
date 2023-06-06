const express = require("express");
const connection = require("../connection");

const path = require("path");
const fs = require("fs");

const router = express.Router();

router.get("/", (req, res) => {
  const sql = `SELECT * 
               FROM cuadros_arte`;

  connection.query(sql, (error, resultObras) => {
    if (error) {
      console.log(error.message);
      res.status(500).json({ message: "error to get the pictures" });
    } else {
      let cant = 0;

      resultObras.forEach((resul) => {
        const sqlImagenesDeLaObra = `SELECT *
                                     FROM imagenes_cuadros_arte
                                     WHERE id_cuadros_arte = ${resul.id}`;

        connection.query(sqlImagenesDeLaObra, (error, resultImagenes) => {
          if (error) {
            console.log(error.message);
            res.status(500).json({ message: "error to get the pictures" });
          } else {
            console.log(resultImagenes);

            resul.images = resultImagenes;

            cant++;

            if (cant === resultObras.length) {
              res.status(200).json(resultObras);
            }
          }
        });
      });
    }
  });
});

const getInsertPicturesArtQuery = (idNewPicture, imagesFileNames) => {
  const sql = `INSERT INTO imagenes_cuadros_arte (id_cuadros_arte, file_image)
  VALUES (?,?), (?, ?), (?, ?), (?, ?)`;

  const values = [];

  imagesFileNames.forEach((file) => {
    values.push(idNewPicture);
    values.push(file);
  });

  return { sql, values };
};

const uploadImages = (filesToUpload) => {
  let imageFileName = "";
  const imagesFileNames = [];

  let i = 1;

  for (let file in filesToUpload) {
    const imageToUpload = filesToUpload[file];
    const ext = path.extname(imageToUpload.name);

    imageFileName = `${Date.now()}_${i}${ext}`;
    i++;

    imagesFileNames.push(imageFileName);
    imageToUpload.mv(`./public/images/pictures_art/${imageFileName}`);
  }

  return imagesFileNames;
};

router.post("/", (req, res) => {
  const newName = req.body.newName;
  const newPrice = req.body.newPrice;
  const newDescription = req.body.newDescription;

  console.log(newName, newPrice, newDescription);

  let imagesFileNames = [];

  console.log(req.files);

  if (req.files) {
    imagesFileNames = uploadImages(req.files);
  }

  console.log("Nombres archivos a subir...", imagesFileNames);

  const sql = `INSERT INTO cuadros_arte (name, price, description)
                VALUES (?, ?, ?)`;

  const values = [newName, newPrice, newDescription];

  //STEP 1: Guardar la obra en la tabla "cuadros_arte"
  connection.query(sql, values, (error, result) => {
    if (error) {
      console.log(error.message);
      res.json({ message: "error to upload the picture" });
    } else {
      //STEP 2: Guardar la ruta de la imagen en la tabla "imagenes_cuadros_arte"

      const idNewPicture = result.insertId;

      const { sql, values } = getInsertPicturesArtQuery(
        idNewPicture,
        imagesFileNames
      );

      connection.query(sql, values, (error, result) => {
        if (error) {
          console.log(error.message);
          res.json({ message: "error to upload the picture" });
        } else {
          res.json(result);
        }
      });
    }
  });
});

const updatePictureArt = ({
  newName,
  newPrice,
  newDescription,
  pictureArtId,
  res,
}) => {
  const sql = `UPDATE cuadros_arte 
                    SET name="${newName}",
                        price=${newPrice},
                        description="${newDescription}"
                        WHERE id=${pictureArtId}`;

  console.log(sql);

  connection.query(sql, (error, result) => {
    if (error) {
      console.log(error.message);
      res.json({ message: "error to update the picture" });
    } else {
      res.json(result);
    }
  });
};

router.put("/:id", (req, res) => {
  console.log(req.body);
  console.log(req.params.id);

  const idObraEdit = req.params.id;

  if (req.files) {
    let imagesFileNames = [];

    if (req.files) {
      imagesFileNames = uploadImages(req.files);
    }

    console.log("Nombres archivos a subir...", imagesFileNames);

    //1- Borro el archivo original
    // 1.1 -> Avergiuar el nombre del archivo/s a eliminar

    const sqlDelete = `SELECT file_image
                       FROM imagenes_cuadros_arte
                       WHERE id_cuadros_arte="${idObraEdit}"`;

    connection.query(sqlDelete, (error, result) => {
      if (error) {
        console.log(error.message);
      } else {
        // 1.2 -> Elimino

        //Eliminar los 4 archivos de forma sincrona
        result.forEach((row) =>
          fs.unlinkSync(`./public/images/pictures_art/${row.file_image}`)
        );

        //2- Borro los registros de la tabla imagenes_cuadros_arte del id que me envien
        const sqlDeleteThree = `DELETE  
                                      FROM imagenes_cuadros_arte 
                                      WHERE id_cuadros_arte="${idObraEdit}"`;

        connection.query(sqlDeleteThree, (error, result) => {
          if (error) {
            console.log(error.message);
          } else {
            console.log(result);

            //3- Hago insert de la/s nueva/s imagen/es

            /*                 const sql = `INSERT INTO imagenes_cuadros_arte (id_cuadros_arte, file_image)
                      VALUES(?,?)`;

                const values = [idObraEdit, imageFileName]; */

            const { sql, values } = getInsertPicturesArtQuery(
              idObraEdit,
              imagesFileNames
            );

            connection.query(sql, values, (error, result) => {
              if (error) {
                console.log(error.message);
                res.json({ message: "error to upload the picture" });
              } else {
                updatePictureArt({
                  newName: req.body.newName,
                  newPrice: req.body.newPrice,
                  newDescription: req.body.newDescription,
                  pictureArtId: req.params.id,
                  res,
                });
              }
            });
          }
        });
      }
    });
  } else {
    console.log("No hay archivo para modificar!");
    updatePictureArt({
      newName: req.body.newName,
      newPrice: req.body.newPrice,
      newDescription: req.body.newDescription,
      pictureArtId: req.params.id,
      res,
    });
  }
});

module.exports = router;

/*

[
    {
        "id": 1,
        "name": "arg",
        "price": 500,
        "description": "solid",
        "order_picture": 1,
        "images": [
            {id: 1, file_image: "image1.JPG"},
            {id: 16, file_image: "image12.JPG"},
            {id: 17, file_image: "image9.JPG"}
        ]
    },
    {
        "id": 2,
        "name": "isr",
        "price": 900,
        "description": "solid",
        "order_picture": 2,
        "images": [
            {id: 2, file_image: "image1.JPG"}
        ]
    },
]

*/
