const order = require("../../models/order");
const mongoose = require('mongoose');



const getOrder = async (req, res) => {
    try {
        const id = req.query.id;
        if (!id) {
            const fetchedOrder = await order.find().populate("store_id").sort({ _id: -1 });
            return res.status(200).json({ success: true, data: fetchedOrder });
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

const getOrderByMonth = async (req, res) => {
    const { year } = req.body;

    try {
        const orderCount = await order.aggregate([
            {
                $project: {
                    year: { $year: "$date_time" },
                    month: { $month: "$date_time" }
                }
            },
            {
                $group: {
                    _id: { year: "$year", month: "$month" },
                    orderCount: { $sum: 1 }
                }
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1 }
            }
        ]);

        // Convert month number to month name
        const months = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];

        // Map the result to the desired format
        const formattedOrderCount = orderCount.filter(item => item._id.year === year).map(item => ({
            year: item._id.year,
            month: months[item._id.month - 1], // Convert month (1-12) to (0-11) for index
            orders: item.orderCount
        }));

        res.status(200).json({
            success: true,
            orderCount: formattedOrderCount
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error });
    }
};
const getoOrderByDate = async (req, res) => {
    try {
        const { start_date, end_date } = req.body;
        // Validate input
        if (!start_date || !end_date) {
            return res
                .status(400)
                .json({ success: false, message: "Both start date and end date is required" });
        }

        // Create Date objects
        const startDate = new Date(start_date);
        const endDate = new Date(end_date);

        // Find orders where the date_time falls within the range
        const orders = await order.find({
            date_time: {
                $gte: startDate,
                $lte: endDate,
            },
        }).populate("store_id", "_id name");

        res.status(200).json({ success: true, data: orders, message: "orders by date fetched succesfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error", error });
    }
};
const getOrderByUserId = async (req, res) => {
    const { userId } = req.body;

    try {
        // Validate input
        if (!userId) {
            return res
                .status(400)
                .json({ success: false, message: "User Id is required" });
        }
        // Check if the provided ID is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ success: false, message: "Invalid user id format" });
        }
        // Find orders where the date_time falls within the range
        const orders = await order.find({
            user_id: userId
        }).populate("store_id", "_id name");

        res.status(200).json({ success: true, data: orders, message: "orders by date fetched succesfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error", error });
    }
};
const getOrderCount = async (req, res) => {
    const start_date = req.query.start_date;
    const end_date = req.query.end_date;
    // Validate input
    if (!start_date || !end_date) {
        return res
            .status(400)
            .json({ success: false, message: "Both start date and end date is required" });
    }
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);
    try {
        const totalOrder = await order.find({
            date_time: {
                $gte: startDate,
                $lte: endDate,
            },
        }).countDocuments();
        res.status(200).json({ success: true, total: totalOrder });
    } catch (error) {
        console.error("Error fetching order count:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
module.exports = {
    getOrder,
    getOrderByMonth,
    getoOrderByDate,
    getOrderByUserId,
    getOrderCount
}