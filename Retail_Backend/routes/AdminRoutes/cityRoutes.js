
const express = require("express");
const { addCity, getCities } = require("../../controller/AdminController/cityController");
const router = express.Router();

router.post('/add',addCity);
router.get('/',getCities)

module.exports = router