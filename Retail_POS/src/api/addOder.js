import axios from "axios";
import SITE_CONFIG from "../../controller";

export const addOrder = async (orderPayload) => {
  // console.log("addOrder", orderPayload)
  // Make API call to fetch products by category ID
  const response = await axios.post(
    `${SITE_CONFIG.apiIP}/order/addorder`,
    
    //   store: "675bc923a9d7c0f8d86dfe96",
      orderPayload ,
    
    {
      headers: {
        Authorization: `Bearer ${SITE_CONFIG.apiToken}`,
      },
    }
  );

  return response.data;
};
