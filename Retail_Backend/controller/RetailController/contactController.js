const ContactUs = require("../../models/contact");



const addContact = async (req, res) => {
    const data = req.body;
    try {
          console.log(data); 
        const newContactus = await ContactUs.create(data)
        res.status(201).send({ success: true, message: "Contact add successfully", data: newContactus })
    } catch (error) {
        console.log(error);
        res.status(400).send({ success: false, message: error.message })
    }
}


module.exports = {addContact}