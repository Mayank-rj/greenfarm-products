import axios from "axios";
import SITE_CONFIG from "../../controller";

export const fetchLatestWebOrder = async (start_date,end_date,store) => {
  // API call to fetch categories
  try {
    const response = await axios.post(
      `${SITE_CONFIG.apiIP}/order/latestweborder`,
      {
        start_date,
        end_date,
        store
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
    return response.data.orders;
  } catch (err) {
    console.error(err.message);
  }
};
