const mongoose = require('mongoose');
const subcategory = require('../../models/subcategory');


const subcategoryByStoreIdandCategoryId = async (req, res) => {
    try {
        const { store,category } = req.body;
        if (!store || !category) {
            return res.status(400).json({
                success: false,
                message: "Store and category are required",
            });
        }
  
        const getbyid = await subcategory.find({ store: store,category:category});
  
        res.status(200).json({success: true, data:getbyid, message:"Successfully fetched subcategory by storeId and categoryId"});;
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error });
    }

}






module.exports = {subcategoryByStoreIdandCategoryId};