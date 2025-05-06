import axios from "axios";
import SITE_CONFIG from "../../controller";

export const fetchMenu = async (store) => {
  // API call to fetch categories
  try {
    const response = await axios.post(
      `${SITE_CONFIG.apiIP}/menu/getmenu`,
      {
        store
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
    // console.log(response);
    
    return response.data.data;
  } catch (err) {
    console.error(err.message);
  }
};
