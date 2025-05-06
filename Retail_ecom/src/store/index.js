import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import counterReducer from "../slices/counterSlice";
import storeReducer from "../slices/storeslice";
import cartReducer from "../slices/cartSlice";
import subcategoryReducer from "../slices/subcategoryslice";
import storeDataReducer from "../slices/storedata";
import orderDataReducer from "../slices/orderDetailsSlice";
import { thunk } from 'redux-thunk';
import newCartReducer from "../slices/cart/newcartReducer";

// Combine reducers
const rootReducer = combineReducers({
  counter: counterReducer,
  store: storeReducer,
  cart: cartReducer,
  newCart: newCartReducer,
  subcategory: subcategoryReducer,
  storeData: storeDataReducer,
  orderDetails: orderDataReducer,
});

// Create the store
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(thunk),
});
