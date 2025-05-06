import axios from "axios";
import SITE_CONFIG from "../../controller";

export const token = async (token) => {
  try {
    // console.log(token);
    
    const response = await axios.post(
      `${SITE_CONFIG.apiIP}/user/verifytoken`,
      {token}, 

      {
        headers: {
          Authorization: `Bearer ${SITE_CONFIG.apiToken}`,
        },
      }
    );
    // console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error login:", error);
    throw new Error(error.response?.data?.error || "An error occurred");
  }
};
