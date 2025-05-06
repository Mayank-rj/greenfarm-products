import { toast } from "react-toastify";
import errorHandler from "./errorHandler";

const fetchData = async (apiMethod, successHandler, toastErrorMessage, toastPendingMessage = null, toastSuccessMessage = null) => {
    const fetchPromise = apiMethod();
    toast.promise(
        fetchPromise,
        {
            pending: toastPendingMessage,
            success: toastSuccessMessage,
            error: {
                render({ data }) {
                    // Extract and return the error message
                    return data?.response?.data?.message || toastErrorMessage;
                },
            },
        }
    );
    try {
        const data = await fetchPromise;
        // console.log(data.data);
        if (data.success) {

            successHandler(data.data);
        } else {
            errorHandler(null, data.message)
        }
    } catch (error) {
        // errorHandler(error, error.response.data.message);
        console.error(error)
    }
}
export default fetchData
