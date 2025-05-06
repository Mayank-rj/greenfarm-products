
const express = require("express");
const { addSubscriber } = require("../../controller/RetailController/subscriberController");



const router = express.Router();


router.post('/addSubscriber', addSubscriber);

module.exports = router