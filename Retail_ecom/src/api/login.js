import axios from "axios";
import SITE_CONFIG from "../../controller";

export const login = async (email, password) => {
  // console.log("Login", email, password);
  try {
    const response = await axios.post(
      `${SITE_CONFIG.apiIP}/user/login`,
      {
        email,
        password,
      },
      {
        headers: {
          Authorization: `Bearer ${SITE_CONFIG.apiToken}`,
        },
      }
    );
    // console.log(response.data.data)
    if (!response.data.success) {
      throw new Error("Failed to fetch Category");
    }
    return response.data;
  } catch (err) {
    console.error(err.message);
  }
};
