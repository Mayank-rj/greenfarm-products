import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  transactionStarted: false,
};

const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    setTransactionState: (state, action) => {
      state.transactionStarted = action.payload; // Accepts true or false
    }
  }
});

export const { setTransactionState } = transactionSlice.actions;
export default transactionSlice.reducer;
