
const express = require("express");
const { addSubcategory, updateSubcategory, getSubcategory, getSubcategoryByCatgeoryId, updateSubcategoryStatus } = require("../../controller/AdminController/subcategoryController");
const router = express.Router();

router.get('/', getSubcategory);
router.post('/add', addSubcategory);
router.post('/update', updateSubcategory);
router.post('/getbycategory',getSubcategoryByCatgeoryId)
router.post('/updatestatus', updateSubcategoryStatus);
module.exports = router