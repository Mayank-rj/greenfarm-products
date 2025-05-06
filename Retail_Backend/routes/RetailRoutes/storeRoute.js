
const express = require("express");
const { getStore, getStorebyid } = require("../../controller/RetailController/storeController");

const router = express.Router();


router.get('/getstore', getStore);
router.post('/getstorebyid', getStorebyid);

module.exports = router