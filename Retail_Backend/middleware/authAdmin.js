const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
const user = require("../models/user");
dotenv.config()

const checkAdmin = async (req, res, next) => {
  // get the user from the jwt token and id to req objectPosition: 
  const token = req.header('AuthToken');
  if (!token) {
    return res.status(401).send({ success: false, message: "Access Denied! token is required"})
  }
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET)    //process.env.JWT_SECRET
    const getbyid = await user.findOne({ _id: data.user.id });
    if (getbyid && getbyid.type === "admin") {
      next()
    }
    else {
      res.status(401).send({ success: false, message: "Access Denied! Invalid token" })
    }

  } catch (error) {
    console.error(error)
    res.status(401).send({ success: false, message: `Internal server error ${error.message}` })

  }


}

module.exports = checkAdmin