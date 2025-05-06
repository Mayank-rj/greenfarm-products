
const express = require("express");
const { getPolicyPages,getPolicyPageByTitle } = require("../../controller/RetailController/policyPagesController");
const router = express.Router();

router.get('/getpolicypage', getPolicyPages);
router.get('/getpolicypagebytitle', getPolicyPageByTitle);
module.exports = router