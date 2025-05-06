import axios from "axios";
import SITE_CONFIG from "../../controller";

export const fetchUserByAuthId = async (_id) => {
    const AuthToken = localStorage.getItem("AuthToken");
  try {
    const response = await axios.post(
      `${SITE_CONFIG.apiIP}/user/getuserbyauthid`,
      {
        _id,
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
      throw new Error("Failed to fetch user id");
    }
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
