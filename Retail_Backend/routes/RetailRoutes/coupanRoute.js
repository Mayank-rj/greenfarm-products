
const express = require("express");
const { getCoupan } = require("../../controller/RetailController/coupanController");

const router = express.Router();

router.get('/getcoupan', getCoupan);

module.exports = router