export const validateAdmin = (adminInfo, setErrors) => {
    let isValid = true;
    const tempErrors = {};

    // Check if first_name is empty
    if (adminInfo.first_name.trim() === '') {
        tempErrors.first_name = 'First name is required';
        isValid = false;
    }

    // Check if last_name is empty
    if (adminInfo.last_name.trim() === '') {
        tempErrors.last_name = 'Last name is required';
        isValid = false;
    }

    // Check if email is empty or invalid
    if (adminInfo.email.trim() === '') {
        tempErrors.email = 'Email is required';
        isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(adminInfo.email)) {
        tempErrors.email = 'Email is not valid';
        isValid = false;
    }

    // // Check if password is empty
    if (adminInfo.password !== undefined && adminInfo.password !== null) {
        console.log("password",adminInfo?.password);
        if (adminInfo?.password?.trim() === '') {
            tempErrors.password = 'Password is required';
            isValid = false;
        } else {
            // Password regex validation
            const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,20}$/;
            if (!passwordPattern.test(adminInfo?.password)) {
                tempErrors.password = 'Password must be 8-20 characters long, include at least one uppercase letter, one lowercase letter, one digit, and one special character';
                isValid = false;
            }
        }
    }

    // Check if gender is selected
    if (adminInfo.gender.trim() === '') {
        tempErrors.gender = 'Gender is required';
        isValid = false;
    }

    // Check if mobile number is empty or invalid
    if (adminInfo.mobile.trim() === '') {
        tempErrors.mobile = 'Mobile number is required';
        isValid = false;
    }

    // Check if country_code is empty
    if (adminInfo.country_code.trim() === '') {
        tempErrors.country_code = 'Country code is required';
        isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
};
