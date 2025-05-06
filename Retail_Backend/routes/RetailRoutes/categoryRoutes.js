
const express = require("express");
const { getCategory, addCategory, updateCategory } = require("../../controller/RetailController/categoryController");
const router = express.Router();

router.get('/', getCategory);
router.post('/add', addCategory);
router.post('/update', updateCategory);
module.exports = router