import axios from "axios";
import SITE_CONFIG from "../../controller";

export const fetchProductBysid = async (store) => {
  // API call to fetch categories
  try {
    const response = await axios.post(
      `${SITE_CONFIG.apiIP}/product/productbystore`,
      {store},
      {
        headers: {
          Authorization: `Bearer ${SITE_CONFIG.apiToken}`,
        },
      }
    );
    if (!response.data.success) {
      throw new Error("Failed to fetch Category");
    }

    const activeProducts = response.data.data.filter(
      (product) => product.status === "active"
    );

    // console.log(activeProducts);

    return activeProducts;

  } catch (err) {
    console.error(err.message);
  }
};
