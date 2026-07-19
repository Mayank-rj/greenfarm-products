const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    store: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Store',
        required: true,
    },
    cover: {
        type: String,
        required: true,
        trim: true,
    },
    name: {
        type: String,
        required: true,
    },
    images: {
        type: [String],
    },
    original_price: {
        type: Number,
        required: true,
    },
    sell_price: {
        type: Number,
        required: true,
    },
    discount: {
        type: Number,
        default: 0,
    },
    descriptions: {
        type: String,
    },
    rating: {
        type: Number,
        default: 0,
    },
    status: {
        type: String,
        enum: ['active', 'deactive'],
        default: 'active',
    },
    variations: {
        type: [{
            name: {
                type: String,
                required: true,
            },
            original_price: {
                type: Number,
                required: true,
            },
            sell_price: {
                type: Number,
                required: true,
            },
            discount: {
                type: Number,
                required: true,
            }
        }],
        default: []
    },
    size: {
        type: String,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',  // Reference to the Category model
        required: true,
    },
    sub_category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subcategory',  // Reference to the SubCategory model
        required: true,
    },
    in_offer: {
        type: Boolean,
        default: true,
    },
    in_stock: {
        type: Boolean,
        default: true,
    },
    unit: {
        type: String,
    },
    quantity: {
        type: Number,
        required: true,
    },
    pos_price: {
        type: Number,
        required: true,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('product', productSchema);
