import axios from "axios";
import SITE_CONFIG from "../../controller";

export const updateOrder = async (orderPayload) => {
  const response = await axios.post(
    `${SITE_CONFIG.apiIP}/order/updateorder`,
    orderPayload,

    {
      headers: {
        Authorization: `Bearer ${SITE_CONFIG.apiToken}`,
      },
    }
  );

  return response.data;
};
