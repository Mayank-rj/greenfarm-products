const mongoose =require("mongoose");

const transactionschema=new mongoose.Schema({
   
    "ref_id":{
        type:String,
        required: true  
    },
    "date":{
        type:Date,
        default: Date.now, 
    },
    "amount":{
        type:String,
        required: true  
    },
    "store_id":{
        type:String,
        required: true  
    },
    "transaction_receipt":{
        type:String,
        required: true  
    },
    "pos_id":{
        type:String,
        required: true  
    },
    "status":{
        type:Boolean,
        required: true  
    }

})

module.exports=mongoose.model("transaction",transactionschema);    
