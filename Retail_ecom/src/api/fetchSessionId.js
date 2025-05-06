import axios from "axios";
import SITE_CONFIG from "../../controller";

export const fetchSessionId = async (session) => {
  // API call to fetch categories
  try {
    const response = await axios.get(
      `${SITE_CONFIG.apiIP}/stripe/fetchsession?session_id=${session}`,
      
      {
        headers: {
          Authorization: `Bearer ${SITE_CONFIG.apiToken}`,
        },
      }
    );
    
    console.log(response);
    
    return response;
  } catch (err) {
    console.error(err.message);
  }
};
