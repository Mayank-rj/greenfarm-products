import axios from "axios";
import SITE_CONFIG from "../../controller";

export const fetchPages = async () => {
  // API call to fetch categories
  try {
    const response = await axios.get(
      `${SITE_CONFIG.apiIP}/policy/getpolicypage`,
      {
        headers: {
          Authorization: `Bearer ${SITE_CONFIG.apiToken}`,
        },
      }
    );
    if (!response.data.success) {
      throw new Error("Failed to fetch Policy pages");
    }
    return response.data.data;
  } catch (err) {
    console.error(err.message);
  }
};
