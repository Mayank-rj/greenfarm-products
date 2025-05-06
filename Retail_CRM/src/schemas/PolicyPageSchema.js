export const validatePolicyPage = (policyPageInfo,setErrors) => {
    let isValid = true;
        const tempErrors = {};

        // Check if first_name is empty
        if (policyPageInfo.title.trim() === '') {
            tempErrors.title = 'Title is required';
            isValid = false;
        }
     
        setErrors(tempErrors);
        return isValid;
  };