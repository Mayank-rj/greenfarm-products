const express = require("express");
const { addOrder, getorderhistory, getOrderCount, deleteOrder, getLatestOrderbyDate, getOrderbyUserId, getOrder, updateOrder, getweborderhistory, getOrderById, orderPaymentStatus } = require("../../controller/RetailController/orderController");
const checkUser = require("../../middleware/authUser");
const router = express.Router();

router.post('/getorderhistory', getorderhistory);
router.post('/getweborderhistory', getweborderhistory);
router.post('/addorder',addOrder);
router.post('/getorderbyid',checkUser, getOrder);
router.post('/webordercount',getOrderCount)
router.post('/deleteorder', deleteOrder);
router.post('/getorderbyuserid', checkUser, getOrderbyUserId);
router.post("/latestorder",(req,res)=>getLatestOrderbyDate(req, res,"pos"));
router.post("/latestweborder",(req,res)=>getLatestOrderbyDate(req, res,"online"));
router.post("/updateorder", updateOrder)
router.post("/orderpaymentstatus", orderPaymentStatus)
// New route
router.get("/getorderbyid",checkUser, getOrderById);
module.exports = router