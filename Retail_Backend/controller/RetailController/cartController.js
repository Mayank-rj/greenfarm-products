const mongoose = require('mongoose');
const cartdata = require('../../models/cart');


const addcart= async (req, res) => {
    try {
        const {store, userId, product_details} = req.body;

        if (!store || !userId || !product_details) {
            return res.status(400).json({success: false, message: "store, userId, and product_details are required." });
        }

        
        let cart = await cartdata.findOne({ store, userId });

        if (cart) {
            cart.product_details =  product_details;
            await cart.save();
            return res.status(200).json({success: true, message: "Product details added to existing cart.",data: cart });
        } else {
            const newCart = new cartdata({ store, userId, product_details });
            await newCart.save();
            return res.status(201).json({success: true, message: "New cart created.", data: newCart });
        }
    } catch (error) {
        console.error("Error creating or updating cart:", error);
        res.status(500).json({ success: false,message: "An error occurred.", error: error.message });
    }

}



const getcart= async (req, res) => {

    try {
        const { store, userId } = req.body;

        if (!store || !userId) {
            return res.status(400).json({success: false, message: "store and userId are required as query parameters." });
        }

       
        const cart = await cartdata.findOne({ store, userId });

        if (cart) {
            return res.status(200).json({ success: true,message: "Cart retrieved successfully.", data:cart });
        } else {
            return res.status(404).json({success: false, message: "Cart not found." });
        }
    } catch (error) {
        console.error("Error fetching cart:", error);
        res.status(500).json({ success: false, message: "An error occurred.", error: error.message });
    }
    
}

module.exports = { addcart,getcart };