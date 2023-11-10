const express = require("express");
const https = require("https");
const http = require("http");

const fs = require("fs");

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

const biographyPictures = require("./routes/biography-pictures");

const paypalRouter = require("./routes/paypal");

const registerRouter = require("./routes/register-router");

const countriesRouter = require("./routes/countries");

const { getConfig } = require("./utils/config");

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

app.use("/biography-pictures", biographyPictures);

app.use("/paypal", paypalRouter);

app.use("/register", registerRouter);

app.use("/countries", countriesRouter);

if (getConfig().mode === "prod") {
  app.get("*", (req, res) => {
    res.sendFile("/home/maia/site/maia_back_end/public/index.html");
  });
}

if (getConfig().mode === "dev") {
  app.listen(8001);
} else {
  const httpsServer = https.createServer(
    {
      key: fs.readFileSync("certs/maiatsintsadzeart.com.key"),
      cert: fs.readFileSync("certs/maiatsintsadzeart.com.crt"),
      ca: [
        fs.readFileSync("certs/CA/AAACertificateServices.crt"),
        fs.readFileSync("certs/CA/SectigoPublicCodeSigningCAEVR36.crt"),
        fs.readFileSync("certs/CA/SectigoPublicCodeSigningCAR36.crt"),
        fs.readFileSync("certs/CA/SectigoPublicCodeSigningRootR46_AAA.crt"),
        fs.readFileSync(
          "certs/CA/SectigoRSAClientAuthenticationandSecureEmailCA.crt"
        ),
        fs.readFileSync("certs/CA/SectigoRSACodeSigningCA.crt"),
        fs.readFileSync(
          "certs/CA/SectigoRSADomainValidationSecureServerCA.crt"
        ),
        fs.readFileSync("certs/CA/SectigoRSADVBundle.pem"),
        fs.readFileSync("certs/CA/SectigoRSAEVBundle.pem"),
        fs.readFileSync(
          "certs/CA/SectigoRSAExtendedValidationCodeSigningCA.crt"
        ),
        fs.readFileSync(
          "certs/CA/SectigoRSAExtendedValidationSecureServerCA.crt"
        ),
        fs.readFileSync(
          "certs/CA/SectigoRSAOrganizationValidationSecureServerCA.crt"
        ),
        fs.readFileSync("certs/CA/SectigoRSAOVBundle.pem"),
        fs.readFileSync(
          "certs/CA/SHA-2 Root  USERTrust RSA Certification Authority.crt"
        ),
        fs.readFileSync("certs/CA/USERTrustRSA-AAACA-xSign.crt"),
      ],
    },
    app
  );

  httpsServer.listen(443, () => {
    console.log("HTTPS running... port 443");
  });

  http
    .createServer((req, res) => {
      res.writeHead(301, {
        Location: "https://" + req.headers["host"] + req.url,
      });
      res.end();
    })
    .listen(80);
}
