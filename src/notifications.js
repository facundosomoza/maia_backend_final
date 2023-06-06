const express = require("express");
const connection = require("../src/connection");

const router = express.Router();

router.post("/", (req, res) => {
  const data = req.body.items;

  const amounts = [];
  let sum = 0;

  data.forEach((dataTwo) => {
    amounts.push(dataTwo.payout_item.amount.value);
    let price = parseFloat(dataTwo.payout_item.amount.value);
    sum = sum + price;
  });
  let average = sum / amounts.length;
  let itemsAmount = amounts.length;
  const totalNumber = { amounts, itemsAmount: itemsAmount, sum, average };
  res.status(403).json(totalNumber);
});

module.exports = router;
