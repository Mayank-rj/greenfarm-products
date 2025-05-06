
const express = require("express");
const { getMenu } = require("../../controller/RetailController/menuController");

const router = express.Router();


router.post('/getmenu', getMenu);

module.exports = router