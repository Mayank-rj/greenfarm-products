export const validateStore = (storeInfo,setErrors) => {
    let isValid = true;
        const tempErrors = {};
    
    console.log(storeInfo);
    
        if (storeInfo.name.trim() === '') {
            tempErrors.name = 'Name is required';
            isValid = false;
        }
        // Check if cover is empty
        if (storeInfo.cover.trim() === '') {
            tempErrors.cover = 'Cover is required';
            isValid = false;
        }

        // Check if mobile is empty and valid
        if (storeInfo.mobile.trim() === '') {
            tempErrors.mobile = 'Mobile number is required';
            isValid = false;
        } else if (!/^\+?\d{10,15}$/.test(storeInfo.mobile)) {
            tempErrors.mobile = 'Mobile number is invalid. Must be between 10 to 15 digits.';
            isValid = false;
        }

        // Check if address is empty
        if (storeInfo.address.trim() === '') {
            tempErrors.address = 'Address is required';
            isValid = false;
        }
        // Check if address is empty
        if (storeInfo.commission.toString().trim() === '') {
            tempErrors.commission = 'commission is required';
            isValid = false;
        }

        // Check if open_time and close_time are valid time strings
        if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(storeInfo.open_time)) {
            tempErrors.open_time = 'Open time must be in HH:MM format';
            isValid = false;
        }
        if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(storeInfo.close_time)) {
            tempErrors.close_time = 'Close time must be in HH:MM format';
            isValid = false;
        }

        // Check if city is empty
        if (storeInfo.city.trim() === '') {
            tempErrors.city = 'City is required';
            isValid = false;
        }
     
        if (storeInfo.abn.trim() === '') {
            tempErrors.abn = 'ABN is required';
            isValid = false;
        }
     
        


        setErrors(tempErrors);
        return isValid;
  };