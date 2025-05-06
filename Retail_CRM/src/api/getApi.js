import axios from 'axios'
import CONFIG from '../config';

const getApi = async (path) => {
    const { baseURL, apiToken } = CONFIG;
    const AuthToken = localStorage.getItem("AdminAuthToken");
    try {
        const response = await axios.get(`${baseURL}${path}`,
            {
                headers: {
                    Authorization: `Bearer ${apiToken}`,
                    AuthToken:AuthToken
                }
            })
        return response.data;
    } catch (error) {
        throw (error);
    }
}
export default getApi