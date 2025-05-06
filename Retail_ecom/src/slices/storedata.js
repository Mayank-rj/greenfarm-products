import { createSlice } from "@reduxjs/toolkit";

const storeDataSlice = createSlice({
  name: "storeData",
  initialState: {
    store: {},
    isEmpty: true
  },
  reducers: {
    setStoreSliceData: (state, action) => {
      state.store = action.payload;
      state.isEmpty = false;
    },
    removeStoreSliceData: (state) => {
      return storeDataSlice.initialState;
    },
  },
});

export const { setStoreSliceData, removeStoreSliceData } = storeDataSlice.actions;

export default storeDataSlice.reducer;
