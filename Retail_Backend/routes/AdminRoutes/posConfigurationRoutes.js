
const express = require("express");
const { getPosConfiguration, addPosConfiguration, updatePosConfiguration, updatePosConfigurationStatus, getPosConfigurationByMac } = require("../../controller/AdminController/posConfigurationController");
const router = express.Router();

router.get('/', getPosConfiguration);
router.post('/add', addPosConfiguration);
router.post('/update', updatePosConfiguration);
router.post('/updatestatus', updatePosConfigurationStatus);

module.exports = router