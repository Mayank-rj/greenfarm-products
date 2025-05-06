import { createSlice, current } from "@reduxjs/toolkit";

const initialState = {
  items: JSON.parse(localStorage.getItem("cartItems")) || [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItemToCart: (state, action) => {
      const existingItemIndex = state.items.findIndex(
        (element) => element.product_id === action.payload.product_id
      );
      // console.log(action.payload);

      if (existingItemIndex !== -1) {
        state.items[existingItemIndex] = {
          ...state.items[existingItemIndex],
          ...action.payload,
        };
      } else {
        state.items.push({
          ...action.payload,
          quantity: action.payload.quantity || 1,
          id: state.items.length + 1,
        });
      }

      localStorage.setItem("cartItems", JSON.stringify(state.items));
    },
    removeItemFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      localStorage.setItem("cartItems", JSON.stringify(state.items));
    },
    updateItemInCart: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find((item) => item.id === id);
      if (item) {
        item.quantity = quantity;
        localStorage.setItem("cartItems", JSON.stringify(state.items));
      }
    },
    clearCart: (state) => {
      state.items = [];
      localStorage.removeItem("cartItems");
    },
    getNumberCartItem: (state) => {
      return state.items.length;
    },
    incrementItemQuantity: (state, action) => {
      const item = state.items.find(
        (item) => item.product_id === action.payload
      );
      if (item) {
        item.quantity += 1;
        localStorage.setItem("cartItems", JSON.stringify(state.items));
      }
    },
    decrementItemQuantity: (state, action) => {
      const item = state.items.find(
        (item) => item.product_id === action.payload
      );
      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1;
          localStorage.setItem("cartItems", JSON.stringify(state.items));
        } else {
          state.items = state.items.filter(
            (item) => item.product_id !== action.payload
          );
          localStorage.setItem("cartItems", JSON.stringify(state.items));
        }
      }
    },
  },
});

export const {
  addItemToCart,
  removeItemFromCart,
  updateItemInCart,
  clearCart,
  getNumberCartItem,
  incrementItemQuantity,
  decrementItemQuantity,
} = cartSlice.actions;
export const selectCartItemCount = (state) => state.cart.items.length;
export const selectCartItemTotalAmount = (state) => {
  let totalAmount = 0;
  state.cart.items.map((item) => {
    totalAmount += parseFloat(item.amount * item.quantity);
  });
  return totalAmount.toString();
};
export const selectCartItemExists = (state, itemId) => {
  // console.log(state)
  return state.cart.items.some((item) => item.product_id === itemId);
};
export const selectItemQuantity = (state, itemId) => {
  const item = state.cart.items.find((item) => item.product_id === itemId);
  return item ? item.quantity : 0;
};

export default cartSlice.reducer;
