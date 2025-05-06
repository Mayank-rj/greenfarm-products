import { createSlice } from "@reduxjs/toolkit";

const zprintDataSlice = createSlice({
  name: "zprintData",
  initialState: {},
  reducers: {
    addzprintData: (state, action) => {
      return action.payload;
    },
  },
});

export const { addzprintData } = zprintDataSlice.actions;
export default zprintDataSlice.reducer;
