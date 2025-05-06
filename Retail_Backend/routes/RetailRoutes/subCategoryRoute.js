
const express = require("express");
const { subcategoryByStoreIdandCategoryId } = require("../../controller/RetailController/subCategoryController");


const router = express.Router();


router.post('/subcategorybystoreandcategory', subcategoryByStoreIdandCategoryId);

module.exports = router