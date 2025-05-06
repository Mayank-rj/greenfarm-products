export const validatePosConfiguration = (posConfigurationInfo, setErrors) => {
  let isValid = true;
  const tempErrors = {};

  // Check if pos_name is empty
  if (posConfigurationInfo.pos_name.trim() === "") {
    tempErrors.pos_name = "POS name is required";
    isValid = false;
  }
  // Check if pin is required
  if (!posConfigurationInfo.pin) {
    tempErrors.pin = "PIN is required";
    isValid = false;
  } else {
    // Check if pin contains exactly 4 digits and only numbers
    const pinRegex = /^[0-9]{4}$/;
    if (!pinRegex.test(posConfigurationInfo.pin)) {
      tempErrors.pin = "PIN must be exactly 4 digits";
      isValid = false;
    }
  }

  // Check if store_ip is empty or invalid IP
  if (posConfigurationInfo.store_ip.trim() === "") {
    tempErrors.store_ip = "Store IP is required";
    isValid = false;
  } else if (
    !/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
      posConfigurationInfo.store_ip
    )
  ) {
    tempErrors.store_ip = "Invalid Store IP address";
    isValid = false;
  }

  // Check if mac_address is empty or invalid format
  if (posConfigurationInfo.mac_address.trim() === "") {
    tempErrors.mac_address = "MAC address is required";
    isValid = false;
  } else if (
    !/^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$/.test(
      posConfigurationInfo.mac_address
    )
  ) {
    tempErrors.mac_address =
      "Invalid MAC address format. Example: 00:1a:2b:3c:4d:5e";
    isValid = false;
  }

  // Check if weight_scale_port is empty
  if (posConfigurationInfo.weight_scale_port.trim() === "") {
    tempErrors.weight_scale_port = "Weight scale port is required";
    isValid = false;
  }

  // Check if store is empty
  if (posConfigurationInfo.store.trim() === "") {
    tempErrors.store = "Store is required";
    isValid = false;
  }

  // Check if baud_rate is empty or invalid
  if (posConfigurationInfo.boud_rate === "") {
    tempErrors.boud_rate = "Boud rate is required";
    isValid = false;
  } else if (posConfigurationInfo.boud_rate < 0) {
    tempErrors.boud_rate = "Boud rate should be greater than or equal to 0";
    isValid = false;
  }

  // Check if baud_rate is empty or invalid
  if (posConfigurationInfo.data_bits === "") {
    tempErrors.data_bits = "Boud rate is required";
    isValid = false;
  } else if (posConfigurationInfo.data_bits <= 0) {
    tempErrors.data_bits = "Boud rate should be greater than or equal to 0";
    isValid = false;
  }

  // Check if parity is empty
  if (posConfigurationInfo.parity.trim() === "") {
    tempErrors.parity = "Parity is required";
    isValid = false;
  }

  // Check if stop_bits is empty
  if (posConfigurationInfo.stop_bits === "") {
    tempErrors.stop_bits = "Stop bits is required";
    isValid = false;
  } else if (posConfigurationInfo.stop_bits < 0) {
    tempErrors.stop_bits = "Stop bits should be greater than or equal to 0";
    isValid = false;
  }

  // Check if flow_type is empty
  if (posConfigurationInfo.flow_type === "") {
    tempErrors.flow_type = "Flow type is required";
    isValid = false;
  }

  // Check if printer_ip is empty or invalid IP
  if (posConfigurationInfo.printer_ip.trim() === "") {
    tempErrors.printer_ip = "Printer IP is required";
    isValid = false;
  } else if (
    !/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
      posConfigurationInfo.printer_ip
    )
  ) {
    tempErrors.printer_ip = "Invalid Printer IP address";
    isValid = false;
  }

  // Check if printer_port is empty
  if (posConfigurationInfo.printer_port === "") {
    tempErrors.printer_port = "Printer port is required";
    isValid = false;
  } else if (posConfigurationInfo.printer_port < 0) {
    tempErrors.printer_port =
      "Printer port should be greater than or equal to 0";
    isValid = false;
  }

  // Check if surcharge is empty
  if (posConfigurationInfo.surcharge === "") {
    tempErrors.surcharge = "Surcharge is required";
    isValid = false;
  } else if (posConfigurationInfo.surcharge < 0) {
    tempErrors.printer_port = "Surcharge should be greater than or equal to 0";
    isValid = false;
  }

  // Check if status is empty
  if (posConfigurationInfo.status.trim() === "") {
    tempErrors.status = "Status is required";
    isValid = false;
  }

  // Set the errors object
  setErrors(tempErrors);
  return isValid;
};
