const express = require("express");
const connection = require("../connection");

const router = express.Router();

router.post("/form_contact", (req, res) => {
  console.log(req);
});

module.exports = router;
