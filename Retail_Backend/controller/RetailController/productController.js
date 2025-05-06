
const Product = require("../../models/product");

const getProductsByCategory = async (req, res) => {
    try {
        const { store,category } = req.body;


        if (!store || !category) {
            return res.status(400).json({
                success: false,
                message: "Store and category are required",
            });
        }

        const products = await Product.find({ store: store ,category:category});

       
        


        res.status(200).json({success: true,products:products,message:"Successfully fetched product by category and store"});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error });
    }
};




const getProductsBysubCategory = async (req, res) => {
    try {
        const { store,sub_category } = req.body;


        if (!store || !sub_category) {
            return res.status(400).json({
                success: false,
                message: "Store and subcategory are required",
            });
        }

        const products = await Product.find({ store: store ,sub_category:sub_category});

        // console.log(products);
        


        res.status(200).json({success: true,products:products,message:"Successfully fetched product by subcategory and store"});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error });
    }
};



const productByStoreId = async (req, res) => {
    try {
        const { store } = req.body;

        if (!store) {
            return res.status(400).json({
                success: false,
                message: "Store  is required",
            });
        }
  
        const getbyid = await Product.find({ store: store,status:"active" });
  
        res.status(200).json({success: true, data:getbyid, message:"Successfully fetched product by storeId"});;
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error });
    }

}




const productByStoreIdandCategoryId = async (req, res) => {
    try {
        const { store,category } = req.body;
   
        if (!store || !category) {
            return res.status(400).json({
                success: false,
                message: "Store and category are required",
            });
        }
  
        const getbyid = await Product.find({ store: store,category:category});
        
  
        res.status(200).json({success: true, data:getbyid, message:"Successfully fetched product by storeId and categoryId"});;
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error });
    }

}

const productByStoreIdandId = async (req, res) => {
    try {
        const{_id} =req.query;
        const { store } = req.body;

        console.log(_id);
        

        if (!store || !_id) {
            return res.status(400).json({
                success: false,
                message: "Store and id are required",
            });
        }
  
        const getbyid = await Product.find({_id:_id, store: store});

        if (!getbyid || getbyid.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No product found for the given store and id",
            });
        }
        
     
       
        res.status(200).json({success: true, data: getbyid, message:"Successfully fetched product by storeId and id"});;
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error });
    }

}

module.exports = { getProductsByCategory,productByStoreId,productByStoreIdandCategoryId,productByStoreIdandId,
    getProductsBysubCategory
 };




