
const express = require("express");
const { getBanner } = require("../../controller/RetailController/bannerController");
const router = express.Router();

router.post('/getbannerbystore', getBanner);

module.exports = router