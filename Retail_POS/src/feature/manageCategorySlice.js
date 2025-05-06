import { createSlice } from "@reduxjs/toolkit";

export const manageCategory = createSlice({
  name: "manageCategory",
  initialState: {
    id: "",
  },
  reducers: {
    setCategoryId: (state, action) => {
      state.id = action.payload;
      // console.log(action.payload);
    },
  },
});

export const { setCategoryId } = manageCategory.actions;

export default manageCategory.reducer;
