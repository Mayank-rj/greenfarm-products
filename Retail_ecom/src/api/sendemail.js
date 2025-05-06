import axios from "axios";
import SITE_CONFIG from "../../controller";

export const sendEmail = async (Data) => {
  // API call to fetch categories
  // console.log(orderDetail);
  try {
    const response = await axios.post(
      `${SITE_CONFIG.apiIP}/user/sendemail`,
      {to:Data.to,
        html:Data.html
      },
      {
        headers: {
          Authorization: `Bearer ${SITE_CONFIG.apiToken}`
        },
      }
    );
    if (!response.data.success) {
      throw new Error("Failed to send email");
    }
    return response.data;
  } catch (err) {
    console.error(err.message);
  }
};
