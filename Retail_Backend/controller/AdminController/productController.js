const { validationResult } = require("express-validator");
const product = require("../../models/product");
const category =require("../../models/category")
const { default: mongoose } = require("mongoose");

const getProducts = async (req, res) => {
    try {
        const id = req.query.id;
        if (!id) {
            const fetchedProduct = await product.find().populate({
                path: "store",
                select: "_id name status"
            }).populate({
                path: 'category',     // Populate the virtual field 'subcategories'
                select: '_id name status',            // Select the fields you want from Subproduct (e.g., 'name')
            }).populate({
                path: 'sub_category',     // Populate the virtual field 'subcategories'
                select: '_id name status',            // Select the fields you want from Subproduct (e.g., 'name')
            }).sort({ _id: -1 });
            return res.status(200).json({ success: true, data: fetchedProduct });
        }

        // Check if the provided ID is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid product id format" });
        }

        const fetchedProduct = await product.findOne({ _id: id });
        if (!fetchedProduct) {
            return res.status(400).json({ success: false, message: "Product not found" });
        }

        return res.status(200).json({ success: true, data: fetchedProduct });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const addProduct = async (req, res) => {
    const data = req.body;
    try {
        // Check if the data already exists (assuming you have a unique field like 'categoryName')
        const existingRecord = await product.findOne({ name: data.name, store: data.store, catgeory: data.category });

        if (existingRecord) {
            return res.status(400).send({ success: false, message: "Product already exists with this name, store and category" });
        }

        const newProduct = await product.create(data)
        res.status(201).send({ success: true, message: "Product created successfully", data: newProduct })
    } catch (error) {
        console.log(error);
        res.status(400).send({ success: false, message: error.message })
    }
}

const updateProduct = async (req, res) => {
    const { _id, ...data } = req.body;

    // Validate required fields
    if (!_id) {
        return res.status(400).json({ success: false, message: "Product ID (_id) is required" });
    }
    if (!data || Object.keys(data).length === 0) {
        return res.status(400).json({ success: false, message: "Data is required and cannot be empty" });
    }
    const existingProduct = await product.findOne({
        name: data.name,
        store: data.store,
        catgeory: data.category,
        _id: { $ne: _id },
    });

    if (existingProduct) {
        return res.status(400).send({
            success: false,
            message: "A product is already exist with this name,store and category",
        });
    }


    try {
        // Find and update the product record
        const updatedConfig = await product.findOneAndUpdate(
            { _id },
            { $set: data },
            { new: true, runValidators: true } // Ensures validators are executed on update
        );

        // If no matching record is found
        if (!updatedConfig) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        // Successfully updated record
        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            data: updatedConfig, // Return the updated record for confirmation
        });
    } catch (error) {
        console.error("Update failed:", error); // Log the error for debugging purposes
        res.status(500).json({
            success: false,
            message: error.message || "An error occurred while updating the product",
        });
    }
};



const getProductCount = async (req, res) => {
    try {
        const totalProducts = await product.countDocuments();
        res.status(200).json({ success: true, total: totalProducts });
    } catch (error) {
        console.error("Error fetching product count:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};


const getProductsByCategory = async (req, res) => {
    try {
        const productCount = await product.aggregate([
            { 
                $group: { 
                    _id: "$category", 
                    Product: { $sum: 1 } 
                }
            },
            {
                $lookup: {
                    from: "categories",  // This is the name of the collection you're referencing
                    localField: "_id",    // The field to join on from the `product` collection (category reference)
                    foreignField: "_id",  // The field to match in the `categories` collection
                    as: "categoryInfo"    // The name of the new array field to add in the output
                }
            },
            {
                $unwind: "$categoryInfo" // Flatten the categoryInfo array so we can access it easily
            },
            {
                $project: {  // Optionally format the output
                    _id: 1,
                    Product: 1,
                    name: "$categoryInfo.name"  // Assuming your category document has a 'name' field
                }
            }
        ]);
        res.status(200).json({  
            success: true,
            productCount: productCount
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error });
    }
};

const updateProductStatus = async (req, res) => {
    const { _id, status } = req.body;

    // Validate required fields
    if (!_id) {
        return res.status(400).json({ success: false, message: "Product ID (_id) is required" });
    }
    if (!status) {
        return res.status(400).json({ success: false, message: "Status is required and cannot be empty" });
    }

    try {
        // Find and update the product record
        const updatedConfig = await product.findOneAndUpdate(
            { _id },
            { $set: { status: status } },
            { new: true, runValidators: true } // Ensures validators are executed on update
        );

        // If no matching record is found
        if (!updatedConfig) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        // Successfully updated record
        res.status(200).json({
            success: true,
            message: "Product status updated successfully",
            data: updatedConfig, // Return the updated record for confirmation
        });
    } catch (error) {
        console.error("Status update failed:", error); // Log the error for debugging purposes
        res.status(500).json({
            success: false,
            message: error.message || "An error occurred while updating the product status",
        });
    }
};

module.exports = {
    getProducts,
    addProduct,
    updateProduct,
    getProductCount,
    getProductsByCategory,
    updateProductStatus
}