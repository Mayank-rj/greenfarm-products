import axios from "axios";
import SITE_CONFIG from "../../controller";

export const fetchTransactionsByDate = async (start_date, end_date, store_id)=> {
    try {
        const response = await axios.post(
            `${SITE_CONFIG.apiIP}/transaction/getTransactionbyDate`,
            {
                start_date: start_date,
                end_date: end_date,
                store_id: store_id
            },
            {
                headers: {
                    Authorization: `Bearer ${SITE_CONFIG.apiToken}`,
                },
            }
        );
        if(!response.data.success) {
            throw new Error("Failed to fetch Transactions");
        }
        return response.data
    } catch (error) {
        console.error(error.message)
    }
}