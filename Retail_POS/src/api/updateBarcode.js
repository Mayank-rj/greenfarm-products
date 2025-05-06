import axios from "axios";
import SITE_CONFIG from "../../controller";

export const updateBarcodeProduct = async (barcodeProductPayload) => {
    // Make API call to fetch products by category ID
    const response = await axios.post(
        `${SITE_CONFIG.apiIP}/barcodeproduct/update`,
        barcodeProductPayload,

        {
            headers: {
                Authorization: `Bearer ${SITE_CONFIG.apiToken}`,
            },
        }
    );

    return response.data;
};
