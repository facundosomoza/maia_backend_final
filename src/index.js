const express = require("express");
const cors = require("cors");

//se encargan de maejar las cookies

const session = require("express-session"); // genera la info de las cookies

const fileUpload = require("express-fileupload");

const FileStore = require("session-file-store")(session); // se encarga de guardar las cookies en archivos (carpeta sessions)

//

const usersRouter = require("./routes/users");

const authRouter = require("./routes/auth");

const picturesArtRouter = require("./routes/picturesart");

const cartRouter = require("./routes/cart");

const formContactRouter = require("./routes/form_contact");

const forgotPasswordRouter = require("./routes/forgot_password");

const adminPictures = require("./routes/admin-pictures");

const app = express();

app.use(express.static("public"));

app.use(fileUpload());

app.use(express.json());

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));

//en esta parte se configura la session
app.use(
  session({
    name: "art_cookie",
    secret: "facundo1234",
    resave: false,
    saveUninitialized: true,
    store: new FileStore(),
  })
);

app.use("/users", usersRouter);

app.use("/auth", authRouter);

app.use("/picturesart", picturesArtRouter);

app.use("/cart", cartRouter);

app.use("/form_contact", formContactRouter);

app.use("/forgot_password", forgotPasswordRouter);

app.use("/admin-pictures", adminPictures);

app.listen(8001);
