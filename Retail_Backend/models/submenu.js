const mongoose = require("mongoose");

const subMenuSchema = new mongoose.Schema({
    store: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Store',
        required: true,
    },
    "subMenu": {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
        }],
        required: true
    },

}, {
    timestamps: true,
})

module.exports = mongoose.model("SubMenu", subMenuSchema);    
