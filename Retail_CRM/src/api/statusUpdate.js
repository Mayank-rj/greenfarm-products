import { toast } from "react-toastify";
import postApi from "./postApi";
import errorHandler from "./errorHandler";

const statusUpdate = async ({title,dataToSend,successHandler,setLoading}) => {
    try {
      let apiPromise;
        apiPromise = postApi(`/${title}/updatestatus`, dataToSend);
        toast.promise(
          apiPromise,
          {
            pending: `${title} status updating...`,
            success: `${title} status updated successfully!`,
            error: {
              render({ data }) {
                // Extract and return the error message
                return data?.response?.data?.message || `${title} status updating failed!`;
              },
            },
          }
        );
      setLoading(true);
      const data = await apiPromise;
      if (data.success) {
        successHandler();
      } else {
        errorHandler(null, data.message)
      }
    } catch (error) {
      errorHandler(error, error.response.data.message);
    } finally {
      setLoading(false)
    }
}

export default statusUpdate;