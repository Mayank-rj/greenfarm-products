import axios from "axios";
import SITE_CONFIG from "../../controller";

export const ordernumber = async (storeId) => {
  const gmtTime = {time:new Date().toString(),timeZone:Intl.DateTimeFormat().resolvedOptions().timeZone};  
  const response = await axios.post(`${SITE_CONFIG.apiIP}/ordernumber`, {
    storeId,
    gmtTime,  
  }, {
    headers: {
      Authorization: `Bearer ${SITE_CONFIG.apiToken}`,
    },
  });

  // console.log(response.data);
  
  return response.data;
};