import { createSlice } from "@reduxjs/toolkit";

const posDataSlice = createSlice({
    name: "posData",
    initialState: {},
    reducers: {
        setPosData: (state, action) => {
            // Directly mutating the state by assigning payload
            return { ...action.payload };
        },
        clearPosData: (state) => {
            // Directly clearing the state object
            return {};
        },
    },
});

export const { setPosData, clearPosData } = posDataSlice.actions;
export default posDataSlice.reducer;
