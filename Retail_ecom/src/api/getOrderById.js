import axios from "axios";
import SITE_CONFIG from "../../controller";

export const getOrderById = async (id) => {
  const AuthToken = localStorage.getItem("AuthToken");
  try {
    const response = await axios.get(
      `${SITE_CONFIG.apiIP}/order/getorderbyid?id=${id}`,
      {
        headers: {
          Authorization: `Bearer ${SITE_CONFIG.apiToken}`,
          AuthToken: AuthToken,
        },
      }
    );
    if (!response.data.success) {
      throw new Error("Failed to fetch Order");
    }

    return response.data;
  } catch (err) {
    throw err;
  }
};
