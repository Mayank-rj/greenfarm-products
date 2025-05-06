import axios from "axios";
import SITE_CONFIG from "../../controller";

export const fetchBanners = async (storeId) => {
  // API call to fetch categories
  try {
    const response = await axios.post(`${SITE_CONFIG.apiIP}/banner/getbannerbystore`, 
      {storeId},
      {
      headers: {
        Authorization: `Bearer ${SITE_CONFIG.apiToken}`,
      },
    });
    if (!response.data.success) {
      throw new Error("Failed to fetch Category");
    }
    return response.data.data;
  } catch (err) {
    console.error(err.message);
  }
};
