const express = require('express');

const connection = require('../connection');

const router = express.Router();

router.get('/', (req, res) => {
  const sql = `SELECT * FROM countries`;

  connection.query(sql, (error, result) => {
    if (error) {
      console.log(error.message);
      res.json({ message: 'error to get the countries list.' });
    } else {
      res.json(result);
    }
  });
});

module.exports = router;
