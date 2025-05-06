import axios from "axios";
import SITE_CONFIG from "../../controller";

export const signUp = async (values) => {
  try {
    const response = await axios.post(
      `${SITE_CONFIG.apiIP}/user/register`,
      {
        ...values,
      },
      {
        headers: {
          Authorization: `Bearer ${SITE_CONFIG.apiToken}`,
        },
      }
    );

    if (!response.data.success) {
      throw new Error("Failed to fetch Category");
    }
    return response.data;
  } catch (err) {
    throw err;
  }
};
