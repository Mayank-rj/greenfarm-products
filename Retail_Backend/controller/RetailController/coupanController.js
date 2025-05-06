const mongoose = require('mongoose');
const coupon = require('../../models/coupon');





const getCoupan = async (req, res) => {
    try {
      const { url } = req;
      if (url.includes("#") || url.includes("?") || url.includes("&")) {
        return res.status(400).json({ error: "Invalid API request" });
      }

     

      const data = await coupon.find();
      return res.status(200).json({ success: true,message: "Coupan get successfully", data: data })
    //   console.log(data);
      
    } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };



  module.exports = { getCoupan };