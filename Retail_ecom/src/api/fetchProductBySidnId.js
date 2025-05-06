import axios from "axios";
import SITE_CONFIG from "../../controller";

export const fetchProductBySidnId = async (store, productId, filter = "") => {

  // API call to fetch categories
  try {
    const response = await axios.post(
      `${SITE_CONFIG.apiIP}/product/productbystoreandid?_id=${productId}`,
      { store },
      {
        headers: {
          Authorization: `Bearer ${SITE_CONFIG.apiToken}`,
        },
      }
    );
    if (!response.data.success) {
      throw new Error("Failed to fetch Product");
    }
    let activeProducts = response.data.data;
    if (filter) {
      activeProducts = response.data.data
        .filter(
          (product) => product.status === filter
        );
    }

    return activeProducts;

  } catch (err) {
    console.error(err.message);
    throw err;
  }
};
