
const express = require("express");
const { addBanner, getBanner, updateBanner, updateBannerStatus } = require("../../controller/AdminController/bannerController");
const router = express.Router();

router.get('/',getBanner)
router.post('/add',addBanner);
router.post('/update',updateBanner);
router.post('/updatestatus', updateBannerStatus);

module.exports = router