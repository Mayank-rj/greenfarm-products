import { createSlice, current } from "@reduxjs/toolkit";

const viewOrderSlice = createSlice({
  name: "displayViewOrder",
  initialState: {
    order: {},
  },
  reducers: {
    showViewOrder: (state, action) => {
      const { payload } = action;
      state.order = (payload);
    },
    clearViewOrder: (state) => {
      state.order = {};
    },
  },
});

export const {
  showViewOrder,
  clearViewOrder,
} = viewOrderSlice.actions;
export default viewOrderSlice.reducer;
