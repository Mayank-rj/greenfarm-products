const mongoose =require("mongoose");

const policyPageSchema=new mongoose.Schema({
   
    "title":{
        type:String,
        required: true
    },
    "content":{
        type:String,
        required: true
    },
    "status": {
        type: String,
        enum: ['active', 'deactive'],
        default: 'active',  // Default status value
    },

}, { timestamps: true })

module.exports=mongoose.model("PolicyPage",policyPageSchema);    
