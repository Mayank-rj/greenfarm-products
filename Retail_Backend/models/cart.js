const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    "store": {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Store',
        required: true,
    },
    "userId": {
        // type: mongoose.Schema.Types.ObjectId,
        // ref: 'User', 
        // required: true,
        type: String,
        required: true
    },
    "product_details": {
        type: [{
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'product',
                required: true
            },
            weight: {
                type: Number,
                required: true,
                default: 0
            },
            price: {
                type: Number,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            variationId: {
                type: String,
                // required: true,
                default: ""
            },
        }],
        default: []
    }

}, {
    timestamps: true,
})

module.exports = mongoose.model("cart", cartSchema);    
