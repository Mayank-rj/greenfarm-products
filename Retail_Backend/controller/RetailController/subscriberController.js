const mongoose = require('mongoose');
const subscriber = require('../../models/subscriber');

const addSubscriber = async (req, res) => {
    const data = req.body;
    try {
      const newSubscriber = await subscriber.create(data)
  
  
      res.status(201).send({ success: true, message: "Subscriber add successfully", data: newSubscriber })
      //  console.log( success);
    } catch (error) {
      console.log(error);
      res.status(400).send({ success: false, message: error.message })
    }
  }


  module.exports = {addSubscriber};