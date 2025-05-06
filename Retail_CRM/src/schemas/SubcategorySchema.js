export const validateSubcategory = (subcategoryInfo, setErrors) => {
    let isValid = true;
    const tempErrors = {};

    // Check if name is empty
    if (subcategoryInfo.name.trim() === '') {
        tempErrors.name = 'Name is required';
        isValid = false;
    }

    // Check if category_id is empty
    if (subcategoryInfo.category.trim() === '') {
        tempErrors.category = 'Category ID is required';
        isValid = false;
    }
    if (subcategoryInfo.store.trim() === '') {
        tempErrors.store = 'Store is required';
        isValid = false;
    }

    // Check if cover is empty
    if (subcategoryInfo.cover.trim() === '') {
        tempErrors.cover = 'Cover is required';
        isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
};