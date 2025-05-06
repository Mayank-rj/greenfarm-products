import axios from "axios";
import SITE_CONFIG from "../../controller";

export const getStoreById = async (store_id ) => {
  try {
    const response = await axios.post(
      `${SITE_CONFIG.apiIP}/store/getstorebyid`,
      { id: store_id },
      {
        headers: {
          Authorization: `Bearer ${SITE_CONFIG.apiToken}`,
        },
      }
    );
    if (!response.data.success) {
      throw new Error("Failed to fetch Store");
    }
    return response.data.data;
  } catch (err) {
    console.error(err.message);
    throw err;
  }
};