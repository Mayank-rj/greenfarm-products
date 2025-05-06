import { createSlice } from "@reduxjs/toolkit";

const storeSlice = createSlice({
  name: "store",
  initialState: {
    selectedStore: null,
  },
  reducers: {
    selectStore: (state, action) => {
      // console.log("Selected Store:", action.payload);
      state.selectedStore = action.payload;
    },
  },
});

export const { selectStore } = storeSlice.actions;
export default storeSlice.reducer;
