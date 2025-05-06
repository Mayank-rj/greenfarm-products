import axios from "axios";
import SITE_CONFIG from "../../controller";

export const fetchuserbyid = async (id) => {
  
  // Make API call to fetch products by category ID
  try {
    const response = await axios.post(
      `${SITE_CONFIG.apiIP}/user/getuserbyid`,
      {
        _id:id
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
    return response.data.data;
  } catch (err) {
    console.error(err.message);
    throw err;
  }
};
