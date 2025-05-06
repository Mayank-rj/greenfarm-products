export const validateProduct = (productInfo, setErrors, variations) => {
  let isValid = true;
  const tempErrors = {};

  // Check if store_id is empty
  if (productInfo.store.trim() === "") {
    tempErrors.store = "Store ID is required";
    isValid = false;
  }

  // Check if cover is empty
  if (productInfo.cover.trim() === "") {
    tempErrors.cover = "Cover is required";
    isValid = false;
  }

  // Check if name is empty
  if (productInfo.name.trim() === "") {
    tempErrors.name = "Name is required";
    isValid = false;
  }

  // Check if original_price is a positive number
  if (productInfo.original_price <= 0) {
    tempErrors.original_price = "Original price must be greater than 0";
    isValid = false;
  }

  // Check if sell_price is a positive number
  if (productInfo.sell_price < 0) {
    tempErrors.sell_price = "Sell price must be greater than 0";
    isValid = false;
  }

  // Check if discount is a percentage between 0 and 100
  if (productInfo.discount < 0 || productInfo.discount > 100) {
    tempErrors.discount = "Discount must be between 0 and 100";
    isValid = false;
  }

  // Check if rating is between 0 and 5
  if (productInfo.rating < 0 || productInfo.rating > 5) {
    tempErrors.rating = "Rating must be between 0 and 5";
    isValid = false;
  }

  // Check if category_id is empty
  if (productInfo.category.trim() === "") {
    tempErrors.category = "Category ID is required";
    isValid = false;
  }

  // Check if in_stock is empty
  if (productInfo.in_stock === "") {
    tempErrors.in_stock = "In-stock information is required";
    isValid = false;
  }

  // Check if unit is empty
  if (productInfo.unit.trim() === "") {
    tempErrors.unit = "Unit is required";
    isValid = false;
  }

  // Check if unit is empty
  if (productInfo.size.trim() === "") {
    tempErrors.size = "Size is required";
    isValid = false;
  }

  // Check if quantity is a positive integer
  if (isNaN(productInfo.quantity) && productInfo.quantity.trim() === "") {
    tempErrors.quantity = "Quantity is required";
  } else if (productInfo.quantity <= 0) {
    tempErrors.quantity = "Quantity must be a positive integer";
    isValid = false;
  }

  // Check if sub_category_id is empty
  if (productInfo.sub_category.trim() === "") {
    tempErrors.sub_category = "Sub-category ID is required";
    isValid = false;
  }

  if (productInfo.size == "variations" && variations.length == 0) {
    tempErrors.variations = "At least 1 variation is required";
    isValid = false;
  }
  // console.log(tempErrors);
  setErrors(tempErrors);
  return isValid;
};
