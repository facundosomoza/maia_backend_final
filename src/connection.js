const mysql = require("mysql2");

const { getConfig } = require("./utils/config");

const { HOST, USER, PASSWORD, DATABASE } = getConfig().db;

const connection = mysql.createConnection({
  host: HOST,
  database: DATABASE,
  user: USER,
  password: PASSWORD,
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
