import axios from "axios";
import SITE_CONFIG from "../../controller";

export const fetchCoupan = async () => {
  // API call to fetch categories
  try {
    const response = await axios.get(
      `${SITE_CONFIG.apiIP}/coupan/getcoupan`,
      {
        headers: {
          Authorization: `Bearer ${SITE_CONFIG.apiToken}`,
        },
      }
    );
    if (!response.data.success) {
      throw new Error("Failed to fetch Coupan");
    }
    return response.data.data;
  } catch (err) {
    console.error(err.message);
  }
};
