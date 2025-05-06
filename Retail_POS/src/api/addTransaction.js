import axios from "axios";
import SITE_CONFIG from "../../controller";

export const addtransaction = async (dataToSend) => {
  try {
    // console.log(dataToSend);

    const response = await axios.post(
      `${SITE_CONFIG.apiIP}/transaction/addtransaction`,
      dataToSend,
      {
        headers: {
          Authorization: `Bearer ${SITE_CONFIG.apiToken}`,
        },
      }
    );

    // console.log(response);
  } catch (error) {
    // if (error.response) {
    //   // Throw error with a message and status code
    //   throw { message: error.response.data?.message || "An error occurred", status: error.response.status };
    // }

    console.error("Error Add Transaction:", error);
    throw new Error(
      error.response?.data?.message || error?.message || "An error occurred"
    );
  }
};
