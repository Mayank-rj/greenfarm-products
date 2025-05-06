const mongoose = require('mongoose');
const store = require('../../models/store');


const getStore = async (req, res) => {
    try {
      const { url } = req;
      if (url.includes("#") || url.includes("?") || url.includes("&")) {
        return res.status(400).json({ error: "Invalid API request" });
      }

     

      const data = await store.find({status: "active"});
      return res.status(200).json({ success: true,message: "Store get successfully", data: data })
      console.log(data);
      
    } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };


  const getStorebyid = async (req, res) => {
    try {
        const {id} = req.body;
        if (!id) {
            const fetchedStore = await store.find().sort({ _id: -1 });
            return res.status(200).json({ success: true, data: fetchedStore });
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid store id format" });
        }

        const fetchedStore = await store.findOne({ _id: id, status: "active" });
        if (!fetchedStore) {
            return res.status(400).json({ success: false, message: "Store not found" });
        }
       
        return res.status(200).json({ success: true, data: fetchedStore });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};



  module.exports = { getStore,getStorebyid};