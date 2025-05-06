const BarcodeProduct = require("../../models/barcodeProduct");

const getBarcodeProductsByStore = async (req, res) => {
  try {
    const { store } = req.body;

    if (!store) {
      return res.status(400).json({
        success: false,
        message: "Store is required",
      });
    }

    const barcodeProducts = await BarcodeProduct.find({ store: store });

    res.status(200).json({
      success: true,
      barcodeProducts: barcodeProducts,
      message: "Successfully fetched barcodeProduct by store",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

const addBarcodeProduct = async (req, res) => {
  const data = req.body;
  try {
    // Check if the data already exists (assuming you have a unique field like 'categoryName')
    const existingRecord = await BarcodeProduct.findOne({
      store: data.store,
      catgeory: data.category,
      barcode: data.barcode,
    });

    if (existingRecord) {
      return res.status(400).send({
        success: false,
        message:
          "Barcode Product already exists with this barcode or name, store and category",
      });
    }

    const newBarcodeProduct = await BarcodeProduct.create(data);
    res.status(201).send({
      success: true,
      message: "Barcode Product created successfully",
      data: newBarcodeProduct,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({ success: false, message: error.message });
  }
};
const updateBarcodeProduct = async (req, res) => {
  const { _id, ...data } = req.body;

  // Validate required fields
  if (!_id) {
    return res.status(400).json({
      success: false,
      message: "Barcode product ID (_id) is required",
    });
  }
  if (!data || Object.keys(data).length === 0) {
    return res.status(400).json({
      success: false,
      message: "Data is required and cannot be empty",
    });
  }
  const existingProduct = await BarcodeProduct.find({
    barcode: data.barcode,
    store: data.store,
    _id: { $ne: _id },
  });

  if (existingProduct.length > 0) {
    return res.status(400).send({
      success: false,
      message:
        "A barcode product is already exist with this barcode, name and store",
    });
  }

  try {
    // Find and update the product record
    const updatedConfig = await BarcodeProduct.findOneAndUpdate(
      { _id },
      { $set: data },
      { new: true } // Ensures validators are executed on update
    );

    // If no matching record is found
    if (!updatedConfig) {
      return res
        .status(404)
        .json({ success: false, message: "Barcode product not found" });
    }

    // Successfully updated record
    res.status(200).json({
      success: true,
      message: "Barcode product updated successfully",
      data: updatedConfig, // Return the updated record for confirmation
    });
  } catch (error) {
    console.error("Update failed:", error); // Log the error for debugging purposes
    res.status(500).json({
      success: false,
      message:
        error.message || "An error occurred while updating the barcode product",
    });
  }
};

const getBarcodeProductsByBarcode = async (req, res) => {
  try {
    const { barcode } = req.body;

    if (!barcode) {
      return res.status(400).json({
        success: false,
        message: "Barcode is required",
      });
    }

    const barcodeProducts = await BarcodeProduct.find({
      barcode: barcode,
      status: "active",
    });

    res.status(200).json({
      success: true,
      barcodeProducts: barcodeProducts,
      message: "Successfully fetched barcode product by barcode",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};
module.exports = {
  getBarcodeProductsByStore,
  addBarcodeProduct,
  updateBarcodeProduct,
  getBarcodeProductsByBarcode,
};
