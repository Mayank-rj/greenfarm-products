export const validateLogin = (loginInfo, setErrors) => {
    let isValid = true;
    const tempErrors = {};

    // Email validation
    if (!loginInfo.email) {
        tempErrors.email = 'Email is required';
        isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(loginInfo.email)) {
        tempErrors.email = 'Email is not valid';
        isValid = false;
    }

    // Password validation
    if (!loginInfo.password) {
        tempErrors.password = 'Password is required';
        isValid = false;
    }
    setErrors(tempErrors);
    return isValid;
};
