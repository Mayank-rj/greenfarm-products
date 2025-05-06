import axios from "axios";
import SITE_CONFIG from "../../controller";

export const addCart = async ({ store, userId, product_details }) => {
  // API call to fetch categories
  const AuthToken = localStorage.getItem("AuthToken");
  try {
    const response = await axios.post(
      `${SITE_CONFIG.apiIP}/cart/addcart`,
      { store, userId, product_details },
      {
        headers: {
          Authorization: `Bearer ${SITE_CONFIG.apiToken}`,
          AuthToken: AuthToken,
        },
      }
    );
    if (!response.data.success) {
      throw new Error("Failed to add cart");
    }
    return response.data;
  } catch (err) {
    console.error(err.message);
    throw err;
  }
};
