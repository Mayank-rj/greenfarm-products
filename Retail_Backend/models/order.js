const mongoose = require("mongoose");

const { Schema } = mongoose;

const orderSchema = new Schema({
    "store_id": {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Store',
        required: true
    },
    "user_id": {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    "date_time": {
        type: Date,
        required: true,
    },
    "payment_mode": {
        type: String,
        required: true
    },
    "order_number": {
        type: String,
        required: true
    },
    "product_details": {
        type: String,
        required: true
    },
    "notes": {
        type: String,
        
    },
    "address": {
        type: String,
        required: true
    },
    "driver_id": {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Driver',
       
    },
    "sub_total": {
        type: Number,
        required: true
    },
    "surcharge": {
        type: Number,
        required: true
    },
    "delivery_charge": {
        type: Number,
       
    },
    "coupon_code": {
        type: String,
        
    },
    "discount": {
        type: Number,
        
    },
    "order_type": {
        type: String,
        required: true
    },
    "change_amount": {
        type: Number,
       
    },
    "tender_amount": {
        type: Number,
       
    },
    "split_cash_amount": {
        type: Number,
      
    },
    "split_card_amount": {
        type: Number,
       
    },
    "reference_id": {
        type: String,
        
    },
    "status": {
        type: String,
        required: true
    },
    "grand_total": {
        type: Number,
        required: true
    },
    "unique_id": {
        type: String,
        required: true,
    },
    "tip_amount": {
        type: Number,
        
    },
    "pickup_date": {
        type: String,
    },
    "store_name": {
        type: String,
    },
    "deliverytype":{
        type: String,
    },
    "isPrinted":{
        type: Boolean,
    },
    "payment_status":{
        type: String,
    }
    
}, {
    timestamps: true,
});

module.exports = mongoose.model("Order", orderSchema);
