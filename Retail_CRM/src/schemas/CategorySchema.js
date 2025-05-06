export const validateCategory = (categoryInfo,setErrors) => {
    let isValid = true;
        const tempErrors = {};

        // Check if first_name is empty
        if (categoryInfo.name.trim() === '') {
            tempErrors.name = 'Name is required';
            isValid = false;
        }
        // Check if cover is empty
        if (categoryInfo.cover.trim() === '') {
            tempErrors.cover = 'Cover is required';
            isValid = false;
        }

        setErrors(tempErrors);
        return isValid;
  };