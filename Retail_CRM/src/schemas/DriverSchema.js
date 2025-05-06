export const validateDriver = (driverInfo, setErrors) => {
    let isValid = true;
    const tempErrors = {};

    // Check if first_name is empty
    if (driverInfo.first_name.trim() === '') {
        tempErrors.first_name = 'First name is required';
        isValid = false;
    }

    // Check if last_name is empty
    if (driverInfo.last_name.trim() === '') {
        tempErrors.last_name = 'Last name is required';
        isValid = false;
    }

    // Check if email is empty or invalid
    if (driverInfo.email.trim() === '') {
        tempErrors.email = 'Email is required';
        isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(driverInfo.email)) {
        tempErrors.email = 'Email is invalid';
        isValid = false;
    }

    // Check if password is empty
    if (driverInfo.password !== undefined && driverInfo.password !== null) {
        if (driverInfo.password.trim() === '') {
            tempErrors.password = 'Password is required';
            isValid = false;
        } else {
            // Password regex validation
            const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,20}$/;
            if (!passwordPattern.test(driverInfo.password)) {
                tempErrors.password = 'Password must be 8-20 characters long, include at least one uppercase letter, one lowercase letter, one digit, and one special character';
                isValid = false;
            }
        }
    } 

    // Check if gender is selected
    if (driverInfo.gender.trim() === '') {
        tempErrors.gender = 'Gender is required';
        isValid = false;
    }

    // Check if city is empty
    if (driverInfo.city.trim() === '') {
        tempErrors.city = 'City is required';
        isValid = false;
    }

    // Check if address is empty
    if (driverInfo.address.trim() === '') {
        tempErrors.address = 'Address is required';
        isValid = false;
    }

    // Check if mobile is empty
    if (driverInfo.mobile.trim() === '') {
        tempErrors.mobile = 'Mobile is required';
        isValid = false;
    }

    // Check if cover is empty
    if (driverInfo.cover.trim() === '') {
        tempErrors.cover = 'Cover is required';
        isValid = false;
    }

    // Check if country_code is empty
    if (driverInfo.country_code.trim() === '') {
        tempErrors.country_code = 'Country code is required';
        isValid = false;
    }
    // Check if country_code is empty
    if (driverInfo.current_status.trim() === '') {
        tempErrors.current_status = 'Current Status is required';
        isValid = false;
    }
    // Check if country_code is empty
    if (driverInfo.address.trim() === '') {
        tempErrors.address = 'Address is required';
        isValid = false;
    }
    setErrors(tempErrors);
    console.log(tempErrors);

    return isValid;
};