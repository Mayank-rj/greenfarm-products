const express = require("express");
const { getStore, addStore, updateStore, getStoreCount, updateStoreStatus } = require("../../controller/AdminController/storeController");
const router = express.Router();

router.get('/', getStore);
router.post('/add', addStore);
router.post('/update', updateStore);
router.get('/count', getStoreCount);
router.post('/updatestatus', updateStoreStatus);
module.exports = router