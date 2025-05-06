import { toast } from 'react-toastify'
const errorHandler = ({error,errorMessage})=>{
    if(error && errorMessage){
        console.error(error);
        toast.error(`${errorMessage}`,2000);
    }
    else if(!error && errorMessage){
        toast.error(`${errorMessage}`,2000);
    }
    else{
        toast.error(`Unexpected Error Occured. Please try again later`,2000);
    }
    
}
export default errorHandler;