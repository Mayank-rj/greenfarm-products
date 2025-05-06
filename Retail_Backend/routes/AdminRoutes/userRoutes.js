
const express = require("express");
const router = express.Router();
const { body } = require("express-validator");

const checkAdmin = require('../../middleware/authAdmin');
const { registerUser, loginUser, getAllUsers, updateUser, updateUserStatus, getUserCount, updateUserbyEmail } = require("../../controller/AdminController/userController");

router.post('/register',
    body('first_name', 'Enter a valid first name').isLength({ min: 3 }),
    body('last_name', 'Enter a valid last name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password should be combination of one uppercase , one lower case, one special char, one digit and min 8 , max 20 char long').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/),
    registerUser
);
router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists(),
],loginUser
);
router.get('/',checkAdmin,(req,res)=>getAllUsers(req,res,"user"));
router.get('/adminuser',checkAdmin,(req,res)=>getAllUsers(req,res,"admin"));
router.post('/update',checkAdmin,updateUser)
router.post('/updateuser',updateUserbyEmail)
router.post('/updatestatus',checkAdmin,updateUserStatus)
router.get('/count', getUserCount);
module.exports = router