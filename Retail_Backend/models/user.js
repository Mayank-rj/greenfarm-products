const mongoose = require("mongoose")

const productschema = new mongoose.Schema({

    "first_name": {
        type: String,
        required:true,
        trim:true
    },
    "last_name": {
        type: String,
        trim:true
    },
    "email": {
        type: String,
        required: true,
        unique: true,
        lowercase: true,  // Ensure emails are lowercase
        match: [/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/, 'Please fill a valid email address'],
    },
    "password": {
        type: String,
        required:true,
        
    },
    "gender": {
        type: String,
        enum: ['male', 'female', 'other'],
        required:true,
    },
    "type": {
        type: String,
        required:true,
    },
    "status": {
        type: String,
        required:true,
        enum: ['active', 'deactive'],
        default:"active"
    },
    "cover": {
        type: String,
        trim: true,
    },
    "mobile": {
        type: String,
        required:true,

    },
    "country_code": {
        type: String,
        required:true,
        trim: true,
    },
    "address": {
        type:[Object],
        
    }

},
{
     timestamps: true
})


module.exports = mongoose.model("User", productschema);