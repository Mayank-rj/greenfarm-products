import axios from "axios";
import SITE_CONFIG from "../../controller";

export const addcontact = async (contactDetails) => {
  // API call to fetch categories
  // console.log(contactDetails);

  try {
    const response = await axios.post(
      `${SITE_CONFIG.apiIP}/contact/addcontact`,
      contactDetails,
      {
        headers: {
          Authorization: `Bearer ${SITE_CONFIG.apiToken}`,
        },
      }
    );
    if (!response.data.success) {
      throw new Error("Failed to add contact");
    }
    return response.data;
  } catch (err) {
    console.error(err.message);
    throw err;
  }
};
