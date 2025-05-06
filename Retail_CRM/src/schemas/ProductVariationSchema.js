export const validateProductVariation = (productVariationInfo, setErrors) => {
  let isValid = true;
  const tempErrors = {};

  // Check if name is empty
  if (productVariationInfo.name.trim() === "") {
    tempErrors.name = "Name is required";
    isValid = false;
  }

  // Check if original_price is a positive number
  if (productVariationInfo.original_price <= 0) {
    tempErrors.original_price = "Original price must be greater than 0";
    isValid = false;
  }

  // Check if sell_price is a positive number
  if (productVariationInfo.sell_price < 0) {
    tempErrors.sell_price = "Sell price must be greater than 0";
    isValid = false;
  }

  // Check if discount is a percentage between 0 and 100
  if (productVariationInfo.discount.trim() === "") {
    tempErrors.discount = "Discount is required";
    isValid = false;
  } else if (
    productVariationInfo.discount < 0 ||
    productVariationInfo.discount > 100
  ) {
    tempErrors.discount = "Discount must be between 0 and 100";
    isValid = false;
  }

  setErrors(tempErrors);
  return isValid;
};
