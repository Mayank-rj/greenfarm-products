export const validateSubMenu = (subMenuInfo,setErrors) => {
    let isValid = true;
        const tempErrors = {};

        // Check if first_name is empty
        if (subMenuInfo.store.trim() === '') {
            tempErrors.store = 'Store is required';
            isValid = false;
        }
        // // Check if first_name is empty
        // if (subMenuInfo.subMenu.length<=5 && subMenuInfo.subMenu.length>=0) {
        //     tempErrors.name = 'Select upto 5 Categories only';
        //     isValid = false;
        // }
        

        setErrors(tempErrors);
        return isValid;
  };