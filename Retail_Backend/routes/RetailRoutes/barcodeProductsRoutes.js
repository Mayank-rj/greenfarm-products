
const express = require("express");
const { getBarcodeProductsByStore, addBarcodeProduct, updateBarcodeProduct, getBarcodeProductsByBarcode } = require("../../controller/RetailController/barcodeProductsController");

const router = express.Router();

router.post('/add', addBarcodeProduct);
router.post('/getbystore', getBarcodeProductsByStore);
router.post('/update', updateBarcodeProduct);
router.post('/getbybarcode', getBarcodeProductsByBarcode);

module.exports = router