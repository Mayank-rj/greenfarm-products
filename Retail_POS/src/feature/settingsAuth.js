import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isAuthenticated: false,
    showSearchBar: false,
}

const settingsAuth = createSlice({
    name: 'settingsAuth',
    initialState,
    reducers: {
        authenticate: (state) => {
            state.isAuthenticated = true;
        },
        resetAuth: (state) => {
            state.isAuthenticated = false;
        },
        toggleSearchBar: (state) => {
            state.showSearchBar = !state.showSearchBar;
        }
    },
});

// Export actions
export const { authenticate, resetAuth, toggleSearchBar } = settingsAuth.actions;

// Export reducer
export default settingsAuth.reducer;
