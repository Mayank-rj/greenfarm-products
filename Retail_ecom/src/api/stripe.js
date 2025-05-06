import axios from "axios";
import SITE_CONFIG from "../../controller";

export const addStripePayment = async (product,orderDetail) => {
  // API call to fetch categories
  // console.log(contactDetails);

  try {
    const response = await axios.post(
      `${SITE_CONFIG.apiIP}/stripe`,
      {product,orderDetail},
      {
        headers: {
          Authorization: `Bearer ${SITE_CONFIG.apiToken}`,
        },
      }
    );
    
    return response;
  } catch (err) {
    console.error(err.message);
    throw err;
  }
};
