import axios from "axios";
import SITE_CONFIG from "../../controller";

export const orderPaymentStatus = async (_id,payment_status) => {
  // API call to fetch categories
  console.log(_id,payment_status);
  
  try {
    const response = await axios.post(
      `${SITE_CONFIG.apiIP}/order/orderpaymentstatus`,
      {
        _id,payment_status
      },
      {
        headers: {
          Authorization: `Bearer ${SITE_CONFIG.apiToken}`,
        },
      }
    );
    if (!response.data.success) {
      throw new Error("Failed to fetch Order");
    }
    // console.log(response);
    
    return response.data;
  } catch (err) {
    console.error(err.message);
  }
};
