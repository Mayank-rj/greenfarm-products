
const express = require("express");
const { getCoupon, addCoupon, updateCoupon, updateCouponStatus } = require("../../controller/AdminController/couponController");
const router = express.Router();

router.get('/', getCoupon);
router.post('/add', addCoupon);
router.post('/update', updateCoupon);
router.post('/updatestatus', updateCouponStatus);
module.exports = router