const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  database: "maia_art",
  user: "root",
  password: "",
});

connection.connect((error) => {
  if (error) {
    console.log("Error to connect to the data bases");
    console.log(error.message);
  } else {
    console.log("Connected to the data bases");
  }
});

module.exports = connection;
