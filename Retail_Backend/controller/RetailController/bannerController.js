const mongoose = require('mongoose');
const banner = require('../../models/banner');




const getBanner = async (req, res) => {
  const { storeId } = req.body;

    try {
      if (!storeId) {
        return res.status(400).json({
            success: false,
            message: "Store is required",
        });
    }

      const data = await banner.find({ store: storeId,status:"active" });
      return res.status(200).json({ success: true,message: "Banner get successfully", data: data })
    //   console.log(data);
      
    } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };



  module.exports = { getBanner };