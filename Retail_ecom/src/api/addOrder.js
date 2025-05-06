import axios from "axios";
import SITE_CONFIG from "../../controller";

export const addOrder = async (orderDetail) => {
  // API call to fetch categories
  // console.log(orderDetail);
  try {
    const response = await axios.post(
      `${SITE_CONFIG.apiIP}/order/addorder`,
      orderDetail,
      {
        headers: {
          Authorization: `Bearer ${SITE_CONFIG.apiToken}`
        },
      }
    );
    if (!response.data.success) {
      throw new Error("Failed to fetch Category");
    }
    return response.data;
  } catch (err) {
    console.error(err.message);
  }
};
