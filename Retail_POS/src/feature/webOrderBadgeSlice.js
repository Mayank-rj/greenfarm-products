import { createSlice } from "@reduxjs/toolkit";

const webOrderBadgeSlice = createSlice({
    name: "webOrderBadgeCount",
    initialState: 0,
    reducers: {
        setWebOrderBadgeCount: (state, action) => {
            // Directly mutating the state by assigning payload
            return action.payload;
        },

    },
});

export const { setWebOrderBadgeCount } = webOrderBadgeSlice.actions;
export default webOrderBadgeSlice.reducer;
