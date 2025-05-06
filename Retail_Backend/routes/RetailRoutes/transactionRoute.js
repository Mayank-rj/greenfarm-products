
const express = require("express");
const { addtransaction, getTransactionbyDate } = require("../../controller/RetailController/transactionController");

const router = express.Router();
router.post('/addtransaction', addtransaction);
router.post('/getTransactionbyDate', getTransactionbyDate);
module.exports = router