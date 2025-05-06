// cartActions.js
import { addCart } from "../../api/addCart";
import { fetchCart } from "../../api/fetchcart";
import {
  FETCH_CART_REQUEST,
  FETCH_CART_SUCCESS,
  FETCH_CART_FAILURE,
  ADD_ITEM_REQUEST,
  ADD_ITEM_SUCCESS,
  ADD_ITEM_FAILURE,
} from "./cartActionTypes";

// Fetch Cart
export const fetchCartDetails = (storeId, userId) => async (dispatch) => {
  // console.log("fetchCartDetails");
  dispatch({ type: FETCH_CART_REQUEST });
  let cart;
  try {
    if (!userId) {
      const storedData =
        JSON.parse(localStorage.getItem("product_details")) || [];
      const localstore = localStorage.getItem("localStoreId");

      const storeIndex = storedData.findIndex(
        (item) => item.store === localstore
      );
      if (storeIndex !== -1) {
        const cartstore = storedData[storeIndex];
        dispatch({ type: FETCH_CART_SUCCESS, payload: cartstore });
      } else {
        dispatch({ type: FETCH_CART_SUCCESS, payload: [] });
      }
    } else {
      cart = await fetchCart(storeId, userId);
      // console.log(cart);

      const storedData =
        JSON.parse(localStorage.getItem("product_details")) || [];
      // console.log(storedData);
      // console.log(storedData);

      const filteredLocalData = storedData?.filter(
        (item) => item.store == storeId
      );

      // console.log(filteredLocalData?.length);

      if (filteredLocalData?.length) {
        const allProducts = [
          ...filteredLocalData[0]?.product_details, // From local storage
          ...cart?.product_details, // From the database
        ];

        // Create a map to track the products by their ID
        const productMap = new Map();

        // Loop through all products and merge their quantities
        allProducts.forEach((product) => {
          const { product: productId, quantity, variationId } = product;

          // Use productId and variationId as a unique key
          const uniqueKey = `${productId}_${variationId || ""}`; // If variationId is empty, treat it as ""

          if (productMap.has(uniqueKey)) {
            const existingProduct = productMap.get(uniqueKey);
            // Keep the product with the higher quantity
            existingProduct.quantity = Math.max(
              existingProduct.quantity,
              quantity
            );
          } else {
            // If the product is not in the map, add it with productId and variationId as key
            productMap.set(uniqueKey, { ...product });
          }
        });

        // Convert the map back to an array
        const mergedProductDetails = Array.from(productMap.values());

        // Create the combined cart object
        // console.log(mergedProductDetails);

        // const combinedCart = {
        //   store: storeId,
        //   product_details: mergedProductDetails,
        // };
        const updatedCart = await addCart({
          store: storeId,
          userId,
          product_details: mergedProductDetails,
        });
        // console.log(updatedCart);
        dispatch({ type: ADD_ITEM_SUCCESS, payload: updatedCart.data });
        // dispatch({ type: FETCH_CART_SUCCESS, payload: combinedCart });
      } else {
        dispatch({ type: FETCH_CART_SUCCESS, payload: cart });
      }
    }
    // }
  } catch (error) {
    dispatch({
      type: FETCH_CART_FAILURE,
      error: error?.response?.data?.message,
      cart: { product_details: [], store: storeId, userId: userId },
    });
  }
};

export const newaddItemToCart =
  (store, userId, product_details, existingCart) => async (dispatch) => {
    dispatch({ type: ADD_ITEM_REQUEST });

    let updatedProductDetails = [...existingCart];
    const productIndex = updatedProductDetails.findIndex(
      (item) =>
        item.product === product_details.product &&
        item.variationId === product_details.variationId
    );
    if (productIndex !== -1) {
      const updatedItem = {
        ...updatedProductDetails[productIndex],
        quantity: product_details.quantity,
        weight: product_details.weight,
        variationId: product_details.variationId,
        price: product_details.price,
        // weight: product_details.weight,
      };

      updatedProductDetails[productIndex] = updatedItem;
    } else {
      updatedProductDetails.push(product_details);
    }

    try {
      // console.log(updatedProductDetails);

      if (!userId) {
        const storedData =
          JSON.parse(localStorage.getItem("product_details")) || [];

        // Check if the store already exists in the array
        const storeIndex = storedData.findIndex((item) => item.store === store);

        if (storeIndex !== -1) {
          // Store exists, update the product details
          storedData[storeIndex].product_details = updatedProductDetails;
        } else {
          // Store doesn't exist, add new store data
          storedData.push({ store, product_details: updatedProductDetails });
        }

        // Save the updated array back to localStorage
        localStorage.setItem("product_details", JSON.stringify(storedData));
        // console.log(updatedProductDetails);
        const data = {
          store: store,
          product_details: updatedProductDetails,
        };
        // localStorage.setItem("product_details", JSON.stringify(data));
        dispatch({ type: ADD_ITEM_SUCCESS, payload: data });
      } else {
        const updatedCart = await addCart({
          store,
          userId,
          product_details: updatedProductDetails,
        });
        dispatch({ type: ADD_ITEM_SUCCESS, payload: updatedCart.data });
        const storedData =
          JSON.parse(localStorage.getItem("product_details")) || [];

        // Check if the store already exists in the array
        const storeIndex = storedData.findIndex((item) => item.store === store);

        if (storeIndex !== -1) {
          // Store exists, update the product details
          storedData[storeIndex].product_details = [];
        } else {
          // Store doesn't exist, add new store data
          storedData.push({ store, product_details: [] });
        }

        // Save the updated array back to localStorage
        localStorage.setItem("product_details", JSON.stringify(storedData));
      }
    } catch (error) {
      dispatch({
        type: ADD_ITEM_FAILURE,
        error: error?.response?.data?.message,
      });
    }
  };
export const newremoveItemFromCart =
  (store, userId, id, variationId, existingCart) => async (dispatch) => {
    dispatch({ type: ADD_ITEM_REQUEST });

    let updatedProductDetails = [...existingCart];
    const productIndex = updatedProductDetails.findIndex(
      (item) => item.product === id && item.variationId === variationId
    );
    if (productIndex !== -1) {
      updatedProductDetails.splice(productIndex, 1);
    }

    try {
      if (!userId) {
        const storedData =
          JSON.parse(localStorage.getItem("product_details")) || [];
        const storeIndex = storedData.findIndex((item) => item.store === store);

        if (storeIndex !== -1) {
          storedData[storeIndex].product_details = updatedProductDetails;
        } else {
          storedData.push({ store, product_details: updatedProductDetails });
        }

        localStorage.setItem("product_details", JSON.stringify(storedData));
        const data = {
          store: store,
          product_details: updatedProductDetails,
        };
        dispatch({ type: ADD_ITEM_SUCCESS, payload: data });
      } else {
        const updatedCart = await addCart({
          store,
          userId,
          product_details: updatedProductDetails,
        });
        dispatch({ type: ADD_ITEM_SUCCESS, payload: updatedCart.data });
      }
    } catch (error) {
      dispatch({
        type: ADD_ITEM_FAILURE,
        error: error?.response?.data?.message,
      });
    }
  };
export const emptyCart = (store, userId) => async (dispatch) => {
  dispatch({ type: ADD_ITEM_REQUEST });
  try {
    // if (!userId) {
    //   localStorage.removeItem("product_details");
    //   dispatch({ type: ADD_ITEM_SUCCESS, payload: [] });
    // } else {
    const storedData =
      JSON.parse(localStorage.getItem("product_details")) || [];
    const updatedData = storedData.filter((item) => item.store !== store);
    // console.log(updatedData);
    localStorage.setItem("product_details", JSON.stringify(updatedData));
    const updatedCart = await addCart({ store, userId, product_details: [] });
    dispatch({
      type: ADD_ITEM_SUCCESS,
      payload: { store, userId, product_details: [] },
    });
    // }
  } catch (error) {
    dispatch({ type: ADD_ITEM_FAILURE, error: error?.response?.data?.message });
  }
};
