
const express = require("express");
const { getCategory, addCategory, updateCategory, updateCategoryStatus } = require("../../controller/AdminController/categoryController");
const router = express.Router();

router.get('/', getCategory);
router.post('/add', addCategory);
router.post('/update', updateCategory);
router.post('/updatestatus', updateCategoryStatus);
module.exports = router