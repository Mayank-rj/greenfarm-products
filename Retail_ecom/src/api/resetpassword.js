import axios from "axios";
import SITE_CONFIG from "../../controller";

export const resetpassword = async (values) => {
    try {
        const response = await axios.post(
            `${SITE_CONFIG.apiIP}/user/resetpassword`,
            {
                ...values,
            },
            {
                headers: {
                    Authorization: `Bearer ${SITE_CONFIG.apiToken}`,
                },
            }
        );

        if (!response.data.success) {
            throw new Error("Failed to reset a passowrd");
        }
        return response.data;
    } catch (err) {
        throw err;
    }
};
