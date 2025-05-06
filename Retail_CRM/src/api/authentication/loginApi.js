import axios from 'axios'
import CONFIG from "../../config"
const loginApi = async ({ email, password }) => {
    const { baseURL, apiToken } = CONFIG;
    try {
        const response = await axios.post(`${baseURL}/user/login`, {
            email: email,
            password: password,
        }, {
            headers: {
                Authorization: `Bearer ${apiToken}`
            }
        })
        return response.data;
    } catch (error) {
        throw(error);
    }
}
export default loginApi