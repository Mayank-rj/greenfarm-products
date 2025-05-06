import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { store } from "./store"; // Make sure to import persistor
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react"; // Import PersistGate
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import ErrorPage from "./Components/ErrorPage";
import HomePage from "./Pages/Home/HomePage";
import Contact from "./Pages/ContactUs/ContactPage.jsx";
import Catalogue from "./Pages/Catalogue/Catalogue";
import Cart from "./Pages/Cart/Cart.jsx";
import ProductPage from "./Pages/ProductPage/ProductPage";
import AllProductPage from "./Pages/AllProductPage/AllProductPage.jsx";
import PolicyPage from "./Pages/PolicyPage/PolicyPage.jsx";
import Profile from "./Pages/Profile/Profile.jsx";
import Order from "./Pages/Profile/Order.jsx";
import Address from "./Pages/Profile/Address.jsx";
import OrderDetails from "./Pages/Profile/OrderDetails.jsx";
import SITE_CONFIG from "../controller.js";
import Sucess from "./Pages/PaymentPage/Sucess.jsx";
import Failed from "./Pages/PaymentPage/Failed.jsx";

const router = createBrowserRouter([
  {
    path: `/`,
    element: <App />,
    errorElement: <ErrorPage />,

    children: [
      {
        index: true,
        element: <Navigate to={`${SITE_CONFIG.linkPath}/home`} />,
      },
      {
        path: `${SITE_CONFIG.basePath}`,
        element: <Navigate to={`${SITE_CONFIG.linkPath}/home`} />,
      },
      {
        path: `${SITE_CONFIG.basePath}/home`,
        element: <HomePage />,
      },
      {
        path: `${SITE_CONFIG.basePath}/cart`,
        element: <Cart />,
      },
      {
        path: `${SITE_CONFIG.basePath}/catalogue`,
        element: <Catalogue />,
      },
      // {
      //   path: `${SITE_CONFIG.basePath}/catalogue/:subcategoryId`,
      //   element: <Catalogue />,
      // },
      {
        path: `${SITE_CONFIG.basePath}/product/:productId/:variationId?`,
        element: <ProductPage />,
      },
      {
        path: `${SITE_CONFIG.basePath}/allproduct`,
        element: <AllProductPage />,
      },
      {
        path: `${SITE_CONFIG.basePath}/policy/:policyName`,
        element: <PolicyPage />,
      },
      {
        path: `${SITE_CONFIG.basePath}/profile`,
        element: <Profile />,
      },
      {
        path: `${SITE_CONFIG.basePath}/orders`,
        element: <Order />,
      },
      {
        path: `${SITE_CONFIG.basePath}/address`,
        element: <Address />,
      },
      { path: `${SITE_CONFIG.basePath}/contact`, element: <Contact /> },
      {
        path: `${SITE_CONFIG.basePath}/orderdetail/:orderId`,
        element: <OrderDetails />,
      },
      {
        path: `${SITE_CONFIG.basePath}/orderdetail/:orderId`,
        element: <OrderDetails />,
      },
    ],
  },
  {
    path: `${SITE_CONFIG.basePath}/success`,
    element: <Sucess />,
  },
  {
    path: `${SITE_CONFIG.basePath}/failed`,
    element: <Failed />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      {/* <PersistGate loading={null} persistor={persistor}> */}
      <RouterProvider router={router} />
      {/* </PersistGate> */}
    </Provider>
  </React.StrictMode>
);
