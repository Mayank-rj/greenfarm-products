
const express = require("express");
const router = express.Router();

const checkAdmin = require('../../middleware/authAdmin');
const { verifyUser } = require("../../controller/AdminController/authController");
router.get('/verify',checkAdmin,
    verifyUser
);

module.exports = router