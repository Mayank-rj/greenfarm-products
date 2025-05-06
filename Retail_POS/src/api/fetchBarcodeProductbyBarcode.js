import axios from "axios";
import SITE_CONFIG from "../../controller";

export const fetchBarcodeProductbyBarcode = async (barcode,store) => {
  // Make API call to fetch products by category ID
  try {
    const response = await axios.post(
      `${SITE_CONFIG.apiIP}/barcodeproduct/getbybarcode`,
        {
        store: store,
        barcode:barcode
      },
      {
        headers: {
          Authorization: `Bearer ${SITE_CONFIG.apiToken}`,
        },
      }
    );
    if (!response.data.success) {
      throw new Error("Failed to fetch Products");
    }
    return response.data.barcodeProducts[0];
  } catch (err) {
    console.error(err.message);
  }
};
