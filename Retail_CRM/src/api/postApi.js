import axios from 'axios'
import CONFIG from '../config';

const postApi = async (path,dataToSend) => {
    const { baseURL, apiToken } = CONFIG;
    const AuthToken = localStorage.getItem("AdminAuthToken");
    try {
        const response = await axios.post(`${baseURL}${path}`,dataToSend,{
            headers: {
                Authorization: `Bearer ${apiToken}`,
                AuthToken: AuthToken
            }
        })
        return response.data;
    } catch (error) {
        throw(error);
    }
}
export default postApi