
const express = require("express");
const {  getProductsByCategory, productByStoreId, productByStoreIdandCategoryId, productByStoreIdandId, getProductsBysubCategory } = require("../../controller/RetailController/productController");
const router = express.Router();


router.post('/getProductbyCategoryandStore', getProductsByCategory);
router.post('/productbystore', productByStoreId)
router.post('/productbystoreandcategory', productByStoreIdandCategoryId)
router.post('/productbystoreandid', productByStoreIdandId)
router.post('/getproductsbysubcategory', getProductsBysubCategory)

module.exports = router