const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    "coupon_code": {
        type: String,
        required: true,
        unique:true,
        trim: true,
    },
    "description": {
        type: String,
        trim: true,
    },
    
    "discount_type": {
        type: String,
        enum:['flat','percent'],
        default: 'percent',
        required: true,
    },
    "discount_value": {
        type: Number,
        default: 0,
        min:0,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['active', 'deactive'],
        default:"active"
    },
    "exp_date": {
        type: Date,
        required: true,
    },
    
}, {
    timestamps: true,
});

module.exports = mongoose.model('Coupon', couponSchema);
