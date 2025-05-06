
const express = require("express");
const { getSubMenuByStore, updateSubMenu } = require("../../controller/AdminController/subMenuController");
const router = express.Router();

router.post('/bystore', getSubMenuByStore);
router.post('/update', updateSubMenu);

module.exports = router