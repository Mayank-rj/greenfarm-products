
const express = require("express");
const { getOrder, getOrderByMonth, getoOrderByDate, getOrderByUserId, getOrderCount } = require("../../controller/AdminController/orderController");
const router = express.Router();

router.get('/', getOrder);
router.post('/ordersbymonth', getOrderByMonth);
router.post('/bydate', getoOrderByDate);
router.post('/byuserid', getOrderByUserId);
router.get('/count', getOrderCount);
module.exports = router