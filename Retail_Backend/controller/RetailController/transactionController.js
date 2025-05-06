const transaction = require("../../models/transaction");



const addtransaction = async (req, res) => {
    const data = req.body;

    try {
        await transaction.create({ ...data });
        res.send({ success: true,
            message: "Success"});
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Internal Server Error', error });
    }
};


const getTransactionbyDate = async (req, res) => {
    try {
      const { start_date, end_date, store_id } = req.body;
      console.log(req.body);
  
      if (!start_date || !end_date) {
        return res
          .status(400)
          .json({ error: "Both start_date and end_date are required" });
      }
  
      if (!store_id) {
        return res.status(400).json({ error: "Store is required" });
      }
  
      const storeExists = await transaction.findOne({ store_id: store_id });
  
      if (!storeExists) {
        return res.status(404).json({ error: "Store id not found" });
      }
  
      const startDate = new Date(start_date);
      const endDate = new Date(end_date);
  
      endDate.setHours(23, 59, 59, 999);
  
      console.log("Start Date:", startDate);
      console.log("End Date:", endDate);
  
      const transactions = await transaction.find({
        store_id,
        date: {
          $gte: startDate,
          $lte: endDate,
        },
      }).sort({ date: -1 });
  
    
      return res.status(200).json({ success: true, message: "transactions get successfully by date and time", data: transactions })
   
    } catch (error) {
      console.error(error);
      res.status(500).json({success: false, message: "Internal server error"  });
    }
  };
  

module.exports = {
addtransaction,getTransactionbyDate
};
