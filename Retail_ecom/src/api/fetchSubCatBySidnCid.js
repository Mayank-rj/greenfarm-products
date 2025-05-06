import axios from "axios";
import SITE_CONFIG from "../../controller";

export const fetchSubCatBySidnCid = async (category, store) => {
  // API call to fetch categories
  try {
    const response = await axios.post(
      `${SITE_CONFIG.apiIP}/subcategory/subcategorybystoreandcategory`,
      {
        category,
        store,
      },
      {
        headers: {
          Authorization: `Bearer ${SITE_CONFIG.apiToken}`,
        },
      }
    );
    if (!response.data.success) {
      throw new Error("Failed to fetch Category");
    }
    return response.data.data;
  } catch (err) {
    console.error(err.message);
  }
};
