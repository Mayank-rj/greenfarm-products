
const express = require("express");
const { getPolicyPage, addPolicyPage, updatePolicyPage, updatePolicyPageStatus } = require("../../controller/AdminController/policyPageController");
const router = express.Router();

router.get('/', getPolicyPage);
router.post('/add', addPolicyPage);
router.post('/update', updatePolicyPage);
router.post('/updatestatus', updatePolicyPageStatus);
module.exports = router