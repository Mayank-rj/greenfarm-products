const mongoose = require('mongoose');
const submenu = require('../../models/submenu');



const getMenu = async (req, res) => {
    try {
      const { url } = req;
      if (url.includes("#") || url.includes("?") || url.includes("&")) {
        return res.status(400).json({ error: "Invalid API request" });
      }

     const{store}=req.body

     if(!store){
        return res.status(400).json({ success: false, message: "store is required" });
     }

      const data = await submenu.find({store}).populate("subMenu");
      return res.status(200).json({ success: true, data: data ,message: "SubMenu get successfully" })

      
    } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };



  module.exports = { getMenu };