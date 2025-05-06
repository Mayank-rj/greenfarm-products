import axios from "axios";
import SITE_CONFIG from "../../controller";

export const addBarcodeProduct = async (barcodeProductPayload) => {
    // Make API call to fetch products by category ID
    const response = await axios.post(
        `${SITE_CONFIG.apiIP}/barcodeproduct/add`,

        //   store: "675bc923a9d7c0f8d86dfe96",
        barcodeProductPayload,

        {
            headers: {
                Authorization: `Bearer ${SITE_CONFIG.apiToken}`,
            },
        }
    );

    return response.data;
};
