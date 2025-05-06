const mongoose =require("mongoose");

const citySchema=new mongoose.Schema({
   
    "name":{
        type:String,
        required: true
        
    },

}, { timestamps: true })
// console.log(mongoose.model('Categories',productSchema))
module.exports=mongoose.model("City",citySchema);    
