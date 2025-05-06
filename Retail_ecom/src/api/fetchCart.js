import axios from "axios";
import SITE_CONFIG from "../../controller";

export const fetchCart = async (store, userId) => {
  const AuthToken = localStorage.getItem("AuthToken");
  try {
    const response = await axios.post(
      `${SITE_CONFIG.apiIP}/cart/getcart`,
      {
        store,
        userId,
      },
      {
        headers: {
          Authorization: `Bearer ${SITE_CONFIG.apiToken}`,
          AuthToken: AuthToken,
        },
      }
    );
    // if (!response.data.success) {
    //   throw new Error("Failed to fetch Cart");
    // }
    // console.log(response.data.data);

    return response.data.data;
  } catch (err) {
    throw err;
  }
};
