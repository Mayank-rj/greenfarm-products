
const express = require("express");
const { getDriver, addDriver, updateDriver, updateDriverStatus } = require("../../controller/AdminController/driverController");
const router = express.Router();

router.get('/', getDriver);
router.post('/add', addDriver);
router.post('/update', updateDriver);
router.post('/updatestatus', updateDriverStatus);
module.exports = router