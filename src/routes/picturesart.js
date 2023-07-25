const express = require("express");
const connection = require("../connection");

const path = require("path");
const fs = require("fs");

const router = express.Router();

router.get("/", (req, res) => {
  const sql = `SELECT * 
               FROM cuadros_arte
               ORDER BY order_picture`;

  connection.query(sql, (error, resultObras) => {
    console.log("OBRAS...", resultObras);

    if (error) {
      console.log(error.message);
      res.status(500).json({ message: "error to get the pictures" });
    } else {
      let cant = 0;

      if (resultObras.length > 0) {
        resultObras.forEach((resul) => {
          const sqlImagenesDeLaObra = `SELECT *
                                      FROM imagenes_cuadros_arte
                                      WHERE id_cuadros_arte = ${resul.id}
                                      ORDER BY order_file`;

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
      } else {
        res.status(200).json(resultObras);
      }
    }
  });
});

const getInsertPicturesArtQuery = (idNewPicture, imageFiles) => {
  const sql = `INSERT INTO imagenes_cuadros_arte (id_cuadros_arte, file_image, order_file)
               VALUES  ${imageFiles
                 .map((imageFileName) => "(?, ?, ?)")
                 .join()}`;

  const values = [];

  console.log("IMAGENES A INSERTAR EN UPDATE", imageFiles);

  imageFiles.forEach((file) => {
    values.push(idNewPicture);
    values.push(file.name);
    values.push(file.order);
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

  const orderKeys = Object.keys(req.body).filter((key) =>
    key.includes("order_")
  );

  console.log(newName, newPrice, newDescription, orderKeys);

  orderKeys.forEach((orderKey) => {
    const pos = orderKey.split("_")[1];

    console.log(pos, req.body[orderKey]);
  });

  let imagesFileNames = [];

  console.log(req.files);

  if (req.files) {
    imagesFileNames = uploadImages(req.files);
  }

  console.log("Nombres archivos a subir...", imagesFileNames);

  const imageFiles = imagesFileNames.map((imageFileName, index) => {
    return { name: imageFileName, order: req.body[`order_${index + 1}`] };
  });

  console.log("imageFiles...", imageFiles);

  const lastOrderQuery = `SELECT MAX(order_picture) AS last_order
                          FROM cuadros_arte`;

  connection.query(lastOrderQuery, (error, result) => {
    let lastOrder = 0;

    if (error) {
      console.log(error.message);
      res.json({ message: "error to upload the picture" });
    } else {
      if (result.length > 0 && result[0]) {
        lastOrder = result[0].last_order;
      }

      lastOrder++;

      const sql = `INSERT INTO cuadros_arte (name, price, description, order_picture)
                VALUES (?, ?, ?, ?)`;

      const values = [newName, newPrice, newDescription, lastOrder];

      //Guardar la obra en la tabla "cuadros_arte"
      connection.query(sql, values, (error, result) => {
        if (error) {
          console.log(error.message);
          res.json({ message: "error to upload the picture" });
        } else {
          // Guardar la ruta de la imagen en la tabla "imagenes_cuadros_arte"

          const idNewPicture = result.insertId;

          const { sql, values } = getInsertPicturesArtQuery(
            idNewPicture,
            imageFiles
          );

          console.log("SQL...", sql, values);

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

router.put("/order_pictures", (req, res) => {
  const newOrders = req.body;

  const cantImages = newOrders.length;

  let updatedImagesCounter = 0;

  newOrders.forEach(({ id, order_picture }) => {
    console.log(id, order_picture);
    const sql = `UPDATE cuadros_arte
                 SET order_picture = ${order_picture}
                 WHERE id = ${id}`;

    connection.query(sql, (error, result) => {
      if (error) {
        console.log(error.message);
        res.status(500).json({ message: "Error updating picture order" });
      } else {
        updatedImagesCounter++;

        if (updatedImagesCounter === cantImages) {
          res
            .status(200)
            .json({ message: "Picture order updated succesfully" });
        }
      }
    });
  });
});

router.put("/:id", (req, res) => {
  const orderKeys = Object.keys(req.body).filter((key) =>
    key.includes("order_")
  );

  orderKeys.forEach((key) => {
    console.log(key.split("_")[1], req.body[key]);

    const id_cuadros_arte = key.split("_")[1];
    const newOrder = req.body[key];

    const sql = `UPDATE imagenes_cuadros_arte 
                 SET order_file="${newOrder}"
                 WHERE id=${id_cuadros_arte}`;

    console.log(sql);

    connection.query(sql, (error, result) => {
      if (error) {
        console.log(error.message);
        //res.json({ message: "error to update the picture order" });
      }
    });
  });

  if (req.files) {
    for (let file in req.files) {
      const imageToUpload = req.files[file];

      const fileOriginalIndex = file.charAt(4);

      const originalFileName = req.body[`originalFile${fileOriginalIndex}`]
        .split("/")
        .pop();

      imageToUpload.mv(`./public/images/pictures_art/${originalFileName}`);
    }

    updatePictureArt({
      newName: req.body.newName,
      newPrice: req.body.newPrice,
      newDescription: req.body.newDescription,
      pictureArtId: req.params.id,
      res,
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

  console.log(req.body);
});

router.put("/:id/sold", (req, res) => {
  const imageId = req.params.id;
  const { sold } = req.body;

  const sql = `UPDATE cuadros_arte
                SET sold = ${sold ? 1 : 0}
                WHERE id = ${imageId}`;

  connection.query(sql, (error, result) => {
    if (error) {
      console.log(error.message);
      res.status(500).json({ message: "error updating sold" });
    } else {
      res.status(200).json({ message: "succesfully updated" });
    }
  });
});

router.delete("/:id", (req, res) => {
  const pictureId = req.params.id;

  console.log(pictureId);

  const sqlOrderCuadroArteToDelete = `SELECT order_picture
                                      FROM cuadros_arte
                                      WHERE id=?`;

  connection.query(sqlOrderCuadroArteToDelete, [pictureId], (error, result) => {
    if (error) {
      console.log(error.message);
      res.status(500).json({ message: "Error deleting picture" });
    } else {
      console.log("El order es", result[0].order_picture);

      const orderImageToDelete = result[0].order_picture;

      const sqlImagesCuadroArte = `SELECT file_image
                               FROM imagenes_cuadros_arte
                               WHERE id_cuadros_arte = ${pictureId}`;

      connection.query(sqlImagesCuadroArte, (error, result) => {
        if (error) {
          console.log(error.message);
          res.status(500).json({ message: "Error deleting picture" });
        } else {
          const filesToDelete = result;

          for (let fileToDelete of filesToDelete) {
            console.log(
              "borrar",
              `./public/images/pictures_art/${fileToDelete.file_image}`
            );
            fs.unlinkSync(
              `./public/images/pictures_art/${fileToDelete.file_image}`
            );
          }

          //Borro primero los items de los carritos que apunten a esta pictureart
          const deletePictureArtFromCarts = `DELETE FROM carrito
                                             WHERE id_obra_arte = ${pictureId}`;

          connection.query(deletePictureArtFromCarts, (error, result) => {
            if (error) {
              console.log(error.message);
              res.status(500).json({ message: "Error deleting picture" });
            } else {
              const deleteImagesQuery = `DELETE FROM imagenes_cuadros_arte
              WHERE id_cuadros_arte = ${pictureId}`;

              connection.query(deleteImagesQuery, (error, result) => {
                if (error) {
                  console.log(error.message);
                  res.status(500).json({ message: "Error deleting picture" });
                } else {
                  const deletePictureQuery = `DELETE FROM cuadros_arte
                          WHERE id = ${pictureId}`;

                  connection.query(deletePictureQuery, (error, result) => {
                    if (error) {
                      console.log(error.message);
                      res
                        .status(500)
                        .json({ message: "Error deleting picture" });
                    } else {
                      //Reorder

                      const sqlReorderPictures = `UPDATE cuadros_arte
                              SET order_picture = order_picture - 1
                              WHERE order_picture > ?`;

                      connection.query(
                        sqlReorderPictures,
                        [orderImageToDelete],
                        (error, result) => {
                          if (error) {
                            console.log(error.message);
                            res
                              .status(500)
                              .json({ message: "Error deleting picture" });
                          } else {
                            res
                              .status(200)
                              .json({ message: "picture deleted succesfully" });
                          }
                        }
                      );
                    }
                  });
                }
              });
            }
          });
        }
      });
    }
  });
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
