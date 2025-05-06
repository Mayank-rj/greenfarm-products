
const express = require("express");
const { addcart, getcart } = require("../../controller/RetailController/cartController");
const checkUser = require("../../middleware/authUser");

const router = express.Router();

router.post('/addcart',checkUser, addcart);
router.post('/getcart',checkUser, getcart);

module.exports = router