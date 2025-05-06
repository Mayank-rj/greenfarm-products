import errorHandler from "../errorHandler"
import axios from 'axios'
import CONFIG from "../../config"
const verifyUser = async () => {
    const { baseURL, apiToken } = CONFIG;
    const AuthToken = localStorage.getItem("AdminAuthToken");
    try {
        const response = await axios.get(`${baseURL}/auth/verify`, {
            headers: {
                Authorization: `Bearer ${apiToken}`,
                AuthToken: AuthToken
            }
        })
        return response.data;
    } catch (error) {
        throw (error);
    }
}
export default verifyUser