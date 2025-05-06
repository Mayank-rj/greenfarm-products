import axios from "axios";
import SITE_CONFIG from "../../controller";

export const fetchBarcodeProducts = async (store) => {
  // Make API call to fetch products by category ID
  try {
    const response = await axios.post(
      `${SITE_CONFIG.apiIP}/barcodeproduct/getbystore`,
      {
        store: store,
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
    return response.data.barcodeProducts;
  } catch (err) {
    console.error(err.message);
  }
};
