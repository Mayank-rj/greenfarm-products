// cartReducer.js
import {
  FETCH_CART_REQUEST,
  FETCH_CART_SUCCESS,
  FETCH_CART_FAILURE,
  ADD_ITEM_REQUEST,
  ADD_ITEM_SUCCESS,
  ADD_ITEM_FAILURE,
} from "./cartActionTypes"; 

const initialState = {
  cart: {
    product_details: [],
  },
  loading: false,
  error: null,
};

const newcartReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CART_REQUEST:
    case ADD_ITEM_REQUEST:
      return { ...state, loading: true };

    case FETCH_CART_SUCCESS:
      return { ...state, loading: false, cart: action.payload };

    case ADD_ITEM_SUCCESS:
      return { ...state, loading: false, cart: action.payload };

    case ADD_ITEM_FAILURE:
      return { ...state, loading: false, error: action.error };

    case FETCH_CART_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.error,
        cart: action.cart,
      };
    default:
      return state;
  }
};

export default newcartReducer;

export const selectNewCartItemCount = (state) =>
  state.newCart.cart?.product_details?.length || 0;
export const selectNewCartItemTotalAmount = (state) => {
  let totalAmount = 0;
  state.newCart.cart?.product_details?.map((item) => {
    totalAmount += parseFloat(item.price);
  });
  return totalAmount.toFixed(2);
};
export const selectNewcartItemExists = (state, itemId) => {
  return state.newCart.cart?.product_details?.some(
    (item) => item.product === itemId
  );
};
export const selectExistingItem = (state, itemId) => {
  return state.newCart.cart?.product_details?.find(
    (item) => item.product === itemId
  );
};
