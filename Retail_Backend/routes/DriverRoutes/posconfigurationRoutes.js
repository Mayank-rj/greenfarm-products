
const express = require("express");
const { getPosConfigurationByMac } = require("../../controller/DriverController/posConfigurationController");

const router = express.Router();

router.post('/getbymac', getPosConfigurationByMac);
module.exports = router