import axios from "axios";
import SITE_CONFIG from "../../controller";

export const updateUserByAddress = async (_id, address) => {
  const AuthToken = localStorage.getItem("AuthToken");
  // console.log("Fetching user", data);
  try {
    // console.log(_id,address)
    const response = await axios.post(
      `${SITE_CONFIG.apiIP}/user/updateuseraddress`,
      {
        _id,
        address,
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
      throw new Error("Failed to update address");
    }
    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
