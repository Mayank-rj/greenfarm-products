import axios from "axios";
import SITE_CONFIG from "../../controller";

export const deleteHoldOrder = async (_id) => {
  // Make API call to fetch products by category ID
  const response = await axios.post(
    `${SITE_CONFIG.apiIP}/order/deleteorder`,
    { _id },
    {
      headers: {
        Authorization: `Bearer ${SITE_CONFIG.apiToken}`,
      },
    }
  );

  return response.data;
};
