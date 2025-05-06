// src/feature/footerSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  webOrder: false,
  orders: false,
  dltorders: false,
  orderNumber: "",
  uniqueId : ""
};

const footerSlice = createSlice({
  name: "footer",
  initialState,
  reducers: {
    toggleWebOrder: (state) => {
      // state.webOrder = !state.webOrder;
      if (state.webOrder === true) {
        state.webOrder = false;
      } else {
        state.webOrder = true;
        state.orders = false;
      }
    },
    toggleOrders: (state) => {
      // state.orders = !state.orders;
      if (state.orders === true) {
        state.orders = false;
      } else {
        state.orders = true;
        state.webOrder = false;
      }
    },

    toggledltOrder: (state) => {
      state.dltorders = !state.dltorders;
    },

    orderNumber: (state, action) => {
      // console.log(action.payload);
      state.orderNumber = action.payload;
    },
    uniqueId: (state, action) => {
      // console.log(action.payload);
      state.uniqueId = action.payload;
    },
  },
});

export const { toggleWebOrder, toggledltOrder, toggleOrders, orderNumber, uniqueId } =
  footerSlice.actions;
export default footerSlice.reducer;
