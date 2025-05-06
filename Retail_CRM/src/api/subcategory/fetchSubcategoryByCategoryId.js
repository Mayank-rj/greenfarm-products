import axios from 'axios'
import CONFIG from "../../config"
const fetchSubcategoryByCategoryId = async (category,store) => {
    const { baseURL, apiToken } = CONFIG;
    const AuthToken = localStorage.getItem("AdminAuthToken");
    try {
        const response = await axios.post(`${baseURL}/subcategory/getbycategory`,
            { category: category,store:store },
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
export default fetchSubcategoryByCategoryId