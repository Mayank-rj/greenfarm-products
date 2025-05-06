import dayjs from "dayjs";

export const validateCoupon = (couponInfo, setErrors) => {
  let isValid = true;
  const tempErrors = {};
  if (couponInfo.coupon_code.trim() === "") {
    tempErrors.coupon_code = "Coupon code is required";
    isValid = false;
  }

  if (couponInfo.exp_date === "") {
    tempErrors.exp_date = "Expiry date is required";
    isValid = false;
  }
  if (couponInfo.description.trim() === "") {
    tempErrors.description = "Description is required";
    isValid = false;
  }

  if (couponInfo.discount_value === "") {
    tempErrors.discount_value = "Discount value is required";
    isValid = false;
  }

  if (couponInfo.discount_type.trim() === "") {
    tempErrors.discount_type = "Discount type is required";
    isValid = false;
  } else if (couponInfo.discount_type === "percent") {
    if (
      Number(couponInfo.discount_value) > 100 ||
      Number(couponInfo.discount_value) < 0
    ) {
      tempErrors.discount_value = "Discount must be between 0 and 100";
      isValid = false;
    } else if (!/^\d+(\.\d{1,2})?$/.test(couponInfo.discount_value)) {
      tempErrors.discount_value =
        "Discount must be a valid number with up to 2 decimal places";
      isValid = false;
    }
  } else if (couponInfo.discount_type === "amount") {
    if (Number(couponInfo.discount_value) < 0) {
      tempErrors.discount_value = "Discount must be greater than 0";
      isValid = false;
    } else if (!/^\d+(\.\d{1,2})?$/.test(couponInfo.discount_value)) {
      tempErrors.discount_value =
        "Discount must be a valid amount with up to 2 decimal places";
      isValid = false;
    }
  }
  setErrors(tempErrors);
  return isValid;
};
