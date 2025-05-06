const { default: mongoose } = require("mongoose");
const order = require("../../models/order");

const getorderhistory = async (req, res) => {
  try {
    const { start_date, end_date, store } = req.body;
    // Validate input
    if (!start_date || !end_date || !store) {
      return res
        .status(400)
        .json({ error: "start_date, end_date and store are required" });
    }

    // Create Date objects
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);

    // Find orders where the date_time falls within the range
    const orders = await order
      .find({
        store_id: store,
        date_time: {
          $gte: startDate,
          $lte: endDate,
        },
      })
      .sort({ date_time: -1 });

    res.status(200).json({
      success: true,
      orders: orders,
      message: "daily summary data fetch succesfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

const addOrder = async (req, res) => {
  const data = req.body;
  try {
    const newOrder = await order.create(data);

    res.status(201).send({
      success: true,
      message: "Order add successfully",
      data: newOrder,
    });
    //  console.log( success);
  } catch (error) {
    console.log(error);
    res.status(400).send({ success: false, message: error.message });
  }
};
const getOrderCount = async (req, res) => {
  const { start_date, end_date, store } = req.body;

  // Validate input
  if (!start_date || !end_date || !store) {
    return res
      .status(400)
      .json({ error: "start_date, end_date and store are required" });
  }

  // Create Date objects
  const startDate = new Date(start_date);
  const endDate = new Date(end_date);

  try {
    const totalOrders = await order.countDocuments({
      store_id: store,
      order_type: "online",
      date_time: {
        $gte: startDate,
        $lte: endDate,
      },
    });

    res.status(200).json({ success: true, total: totalOrders });
  } catch (error) {
    console.error("Error fetching order count:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const deleteOrder = async (req, res) => {
  const { _id } = req.body;
  if (!_id) {
    return res
      .status(400)
      .send({ success: false, message: "Order ID is required." });
  }
  try {
    const existingOrder = await order.findById(_id);
    if (!existingOrder) {
      return res
        .status(404)
        .send({ success: false, message: "Order not found." });
    }
    let deletestate = await order.deleteOne({ _id: _id });
    res.send({ success: true, message: "deleted successfully" });
  } catch (error) {
    res.status(400).send({ message: "Something went wrong", error });
  }
};

const getLatestOrderbyDate = async (req, res, type) => {
  try {
    const { start_date, end_date, store } = req.body;
    // Validate input
    if (!start_date || !end_date || !store) {
      return res
        .status(400)
        .json({ error: "start_date, end_date and store are required" });
    }

    // Create Date objects
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);

    // Find orders where the date_time falls within the range
    const orders = await order
      .findOne({
        store_id: store,
        date_time: {
          $gte: startDate,
          $lte: endDate,
        },
        order_type: type,
        status: "paid",
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders: orders,
      message: "data fetched succesfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

const getOrderbyUserId = async (req, res) => {
  const { user_id } = req.body;
  if (!user_id) {
    return res
      .status(400)
      .send({ success: false, message: "User ID is required." });
  }
  try {
    let getbyid = await order.find({ user_id }).sort({ date_time: -1 });

    res.send({
      success: true,
      message: "order get by id successfully",
      data: getbyid,
    });
  } catch (error) {
    res.status(400).send({ message: "Something went wrong", error });
  }
};

const getOrder = async (req, res) => {
  try {
    const id = req.body;
    if (!id) {
      const fetchedOrder = await order
        .find()
        .populate("store_id")
        .sort({ _id: -1 });
      return res.status(200).json({ success: true, data: fetchedOrder });
    }

    // Check if the provided ID is a valid ObjectId
    // if (!mongoose.Types.ObjectId.isValid(id)) {
    //     return res.status(400).json({ success: false, message: "Invalid order id format" });
    // }

    const fetchedOrder = await order
      .findOne({ _id: id })
      .populate("store_id", "_id name");
    if (!fetchedOrder) {
      return res
        .status(400)
        .json({ success: false, message: "Order not found" });
    }

    return res.status(200).json({ success: true, data: fetchedOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const updateOrder = async (req, res) => {
  const { _id, isPrinted } = req.body;

  if (!_id || !isPrinted) {
    return res.status(400).json({
      success: false,
      message: "Order ID and isPrinted value is required",
    });
  }

  try {
    const updatedOrder = await order.findByIdAndUpdate(
      _id,
      { isPrinted: isPrinted },
      { new: true }
    );
    if (!updatedOrder) {
      return res
        .status(400)
        .json({ success: false, message: "Unable to Update Order" });
    }
    return res.status(200).json({ success: true, data: updatedOrder });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

const getweborderhistory = async (req, res) => {
  try {
    const { start_date, end_date, store } = req.body;
    // Validate input
    if (!start_date || !end_date || !store) {
      return res
        .status(400)
        .json({ error: "start_date, end_date and store are required" });
    }

    // Create Date objects
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);

    // Find orders where the date_time falls within the range
    const orders = await order
      .find({
        store_id: store,
        date_time: {
          $gte: startDate,
          $lte: endDate,
        },
      })
      .populate('user_id').sort({ date_time: -1 });

    res.status(200).json({
      success: true,
      orders: orders,
      message: "daily summary data fetch succesfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};


// Get Order By Id for e-com
const getOrderById = async (req, res) => {
  try {
      const id = req.query.id;
      if (!id) {
          return res.status(400).json({ success: false, message: "Order id is missing" });
      }

      // Check if the provided ID is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
          return res.status(400).json({ success: false, message: "Invalid order id format" });
      }

      const fetchedOrder = await order.findOne({ _id: id }).populate("store_id", "_id name");
      if (!fetchedOrder) {
          return res.status(400).json({ success: false, message: "Order not found" });
      }

      return res.status(200).json({ success: true, data: fetchedOrder });
  } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


const orderPaymentStatus=async (req, res) => {
  try {
      
      const { _id ,payment_status } = req.body;

      if (!payment_status) {
          return res.status(400).json({ message: "Payment status is required" });
      }

      const existingOrder = await order.findById(_id);

      if (!existingOrder) {
        return res.status(404).json({ message: "Order not found" });
      }
  
      // Prevent updating if the payment_status is already "completed" or "failed"
      if (existingOrder.payment_status === "completed" || existingOrder.payment_status === "failed") {
        return res.status(400).json({ message: `Payment status is already ${existingOrder.payment_status}, cannot update again.` });
      }

      const updatedOrder = await order.findByIdAndUpdate(
          _id,
          { payment_status },
          { new: true } // Return the updated document
      );

      if (!updatedOrder) {
          return res.status(404).json({ message: "Order not found" });
      }

      res.status(200).json({
          message: "Payment status updated successfully",
          data: updatedOrder,
          success: true,
      });
  } catch (error) {
      console.error("Error updating payment status:", error,);
      res.status(500).json({ message: "Internal Server Error",success: false, });
  }
};
module.exports = {
  getOrder,
  getorderhistory,
  addOrder,
  getOrderCount,
  deleteOrder,
  getLatestOrderbyDate,
  getOrderbyUserId,
  updateOrder,
  getweborderhistory,
  getOrderById,
  orderPaymentStatus
};
