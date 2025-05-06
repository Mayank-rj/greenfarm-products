export const validateBanner = (bannerInfo, setErrors) => {
  let isValid = true;
  const tempErrors = {};

  // Check if first_name is empty
  if (bannerInfo.type.trim() === '') {
    tempErrors.type = 'Type is required';
    isValid = false;
  }
  // Check if first_name is empty
  if (bannerInfo.link.trim() === '') {
    tempErrors.link = 'Link is required';
    isValid = false;
  }
  // Check if first_name is empty
  if (bannerInfo.position.trim() === '') {
    tempErrors.position = 'Position is required';
    isValid = false;
  }
  // Check if first_name is empty
  if (bannerInfo.message.trim() === '') {
    tempErrors.message = 'Message is required';
    isValid = false;
  }
  // Check if cover is empty
  if (bannerInfo.cover.trim() === '') {
    tempErrors.cover = 'Cover is required';
    isValid = false;
  }
  // Check if cover is empty
  if (bannerInfo.store.trim() === '') {
    tempErrors.store = 'Store is required';
    isValid = false;
  }
  // Check if cover is empty
  if (bannerInfo.page.trim() === '') {
    tempErrors.page = 'Page is required';
    isValid = false;
  }

  setErrors(tempErrors);
  return isValid;
};