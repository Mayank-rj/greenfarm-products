const city = require("../../models/city");


const addCity = async (req, res) => {
    const data = req.body;
    try {
        // Check if the data already exists (assuming you have a unique field like 'storeName')
        const existingRecord = await city.findOne({ name: data.name });

        if (existingRecord) {
            return res.status(400).send({ message: "City already exists with this name" });
        }

        const newCity = await city.create(data)
        return res.status(201).send({ success: true, message: "City created successfully", data: newCity })
    } catch (error) {
        console.log(error);
        res.status(400).send({ success: false, message: error.message })
    }
}
const getCities = async (req, res) => {
    try {
        // Check if the data already exists (assuming you have a unique field like 'storeName')
        const cities = await city.find();
        return res.status(201).send({ success: true, data: cities })
    } catch (error) {
        console.log(error);
        res.status(400).send({ success: false, message: error.message })
    }
}




module.exports = {
    addCity,
    getCities
}