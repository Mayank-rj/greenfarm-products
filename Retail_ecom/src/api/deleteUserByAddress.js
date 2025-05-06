import axios from "axios";
import SITE_CONFIG from "../../controller";

export const deleteUserByAddress = async (_id, addressId) => {
  // console.log("Fetching user", data);
  const AuthToken = localStorage.getItem("AuthToken");
  try {
    // console.log(_id,address)
    const response = await axios.post(
      `${SITE_CONFIG.apiIP}/user/deleteuseraddress`,
      {
        _id,
        addressId,
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
