import axios from "axios";
import SITE_CONFIG from "../../controller";

export const productByCatnStore = async (cid, sid) => {
  // API call to fetch categories
  try {
    const response = await axios.post(
      `${SITE_CONFIG.apiIP}/product/productbystoreandcategory`,
      {
        category: cid,
        store: sid,
      },
      {
        headers: {
          Authorization: `Bearer ${SITE_CONFIG.apiToken}`,
        },
      }
    );
    if (!response.data.success) {
      throw new Error("Failed to fetch Category");
    }
    
    return response.data.data;
  } catch (err) {
    console.error(err.message);
  }
};
