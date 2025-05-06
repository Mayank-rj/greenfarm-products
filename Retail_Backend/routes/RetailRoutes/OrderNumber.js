
const express = require("express");
const router = express.Router();

let storeOrderNumbers = {storeId:null};
// let currentDate = new Date();

// Reset the order numbers if the date has changed
// const resetOrderNumbersIfNeeded = (gmtTime) => {
//   const today = new Date(gmtTime);
//   // today.setHours(today.getHours() + gmtTime.hours);
//   // today.setMinutes(today.getMinutes() + gmtTime.minutes);
  
//   console.log(gmtTime);
//   console.log(currentDate.toString());
//   console.log(today.toISOString());
//   console.log(currentDate.toISOString());
  
//   const dateOnly1 = today.toISOString().split('T')[0];
//   const dateOnly2 = currentDate.toISOString().split('T')[0];
//   if (dateOnly1 !== dateOnly2) {
//     currentDate = today;
//     storeOrderNumbers = {};
//   }
// };

let currentDate = null;

// Reset the order numbers if the date has changed
const resetOrderNumbersIfNeeded = (gmtTime) => { 
  
if(!currentDate){
currentDate = new Date(gmtTime.time)
}else{
 const today = new Date(gmtTime.time).toLocaleDateString("en-US", { timeZone: gmtTime.timeZone });
const prev =   currentDate.toLocaleDateString("en-US", { timeZone: gmtTime.timeZone }); 
//  console.log(today );
//   console.log(prev );
//   console.log(gmtTime)
  if (today !== prev ) {
    currentDate = new Date(gmtTime.time);
    storeOrderNumbers = {storeId:null};
  }
}
};


// Generate a unique ID for each order
const generateUniqueId = () => {
  const d = new Date();
  return d.getTime();
};

router.post('/', (req, res) => {
  const { storeId, gmtTime } = req.body;

  if (!storeId) {
    return res.status(400).json({ error: 'Store ID is required' });
  }

  if (!gmtTime) {
    return res.status(400).json({ error: 'GMT time is required' });
  }

  // Convert the passed GMT time to a valid ISO string if needed
  // const validGmtTime = convertToGMT(gmtTime);

  // Reset order numbers if the date has changed according to GMT time
  resetOrderNumbersIfNeeded(gmtTime);

  // Initialize the order number for the store if not present
  if (!storeOrderNumbers[storeId]) {
    storeOrderNumbers[storeId] = 1;
  }

  // Format the order number with leading zeros
  const formattedOrderNumber = String(storeOrderNumbers[storeId]).padStart(4, '0');
  const uniqueId = generateUniqueId();

  // Increment the order number for the store
  storeOrderNumbers[storeId]++; 

  res.json({ orderNumber: formattedOrderNumber, uniqueId });
});

module.exports = router;