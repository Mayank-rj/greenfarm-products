import axios from "axios";
import SITE_CONFIG from "../../controller";

export const updateUserById = async (_id, data) => {
  const AuthToken = localStorage.getItem("AuthToken");
  // console.log("Fetching user", data);
  try {
    const response = await axios.post(
      `${SITE_CONFIG.apiIP}/user/updateuser`,
      {
        _id,
        data,
      },
      {
        headers: {
          Authorization: `Bearer ${SITE_CONFIG.apiToken}`,
          AuthToken: AuthToken,
        },
      }
    );
    // console.log(response);
    if (!response.data.success) {
      throw new Error("Failed to fetch Update user ");
    }
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
