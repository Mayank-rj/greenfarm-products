import { createSlice, current } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const displayOrderSlice = createSlice({
  name: "displayOrder",
  initialState: {
    orders: [],
    selectedId: [],
  },
  reducers: {
    showOrder: (state, action) => {
      const { payload } = action;
      // console.log("display payload",payload);
      state.orders.push(payload);
    },
    clearOrder: (state) => {
      state.orders = [];
      state.selectedId = [];
    },
    removeOrder: (state, action) => {
      const idToRemove = action.payload;
      const index = state.orders.findIndex(
        (item) => item.uniqueId === idToRemove
      );
      if (index !== -1) {
        state.orders.splice(index, 1);
        state.selectedId = [];
      }
    },
    updateOrder: (state, action) => {
      const { id, weight } = action.payload;
      const item = state.orders.find((item) => item.uniqueId === id);
      if (item.size === "slider") {
        item.weight = weight;
      }
      else {
        toast.error("Please select weighed Product.")
      }
    },
    setSelectedIds: (state, action) => {
      const id = action.payload;
      // console.log("setSelectedId",id);
      state.selectedId = id;
    },
    manageOrderQuantity: (state, action) => {
      const { uniqueId, increase } = action.payload;
      const index = state.orders.findIndex(
        (item) => String(item.uniqueId) === String(uniqueId)
      );
      // console.log("State orders:", index);
      if (index !== -1) {
        const updatedQuantity = state.orders[index].quantity + (increase ? 1 : -1);
        state.orders[index].quantity = updatedQuantity;
      }
    },
  },
});

export const {
  showOrder,
  removeOrder,
  clearOrder,
  updateOrder,
  setSelectedIds,
  manageOrderQuantity,
} = displayOrderSlice.actions;
export default displayOrderSlice.reducer;
