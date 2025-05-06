import './App.css'
import { AuthProvider } from './utils/context/AuthContext'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router";
import ProtectedRoute from './navigation/ProtectedRoute'
import Login from './pages/login/Login';
import ErrorBoundary from './components/error/ErrorBoundary'
import { Flip, ToastContainer } from 'react-toastify';
import Navbar from './components/navbar/Navbar'
import 'react-toastify/dist/ReactToastify.css';
import BottomNavbar from './components/navbar/BottomNavbar';
import Dashboard from './pages/dashboard/Dashboard';
import SideMenu from './components/sidemenu/SideMenu';
import Layout from './layout/LAyout';
import { Box } from '@mui/material';
import ProductsTable from './pages/products/ProductsTable';
import ProductManage from './pages/products/ProductManage';
import UsersTable from './pages/users/UsersTable';
import UserDetails from './pages/users/UserDetails';
import AdminsTable from './pages/admin/AdminsTable';
import AdminManage from './pages/admin/AdminManage';
import CategoriesTable from './pages/categories/CategoriesTable';
import CategoryManage from './pages/categories/CategoryManage';
import SubcategoriesTable from './pages/subcategories/SubcategoriesTable';
import SubcategoryManage from './pages/subcategories/SubcategoryManage';
import DriversTable from './pages/drivers/DriversTable';
import DriverManage from './pages/drivers/DriverManage';
import BannersTable from './pages/banners/BannersTable';
import BannerManage from './pages/banners/BannerManage';
import StoresTable from './pages/stores/StoresTable';
import StoreManage from './pages/stores/StoreManage';
import CONFIG from './config';
import OrdersTable from './pages/orders/OrdersTable';
import PosConfigurationsTable from './pages/posconfigurations/PosConfigurationsTable';
import NotFoundPage from './components/error/NotFoundPage';
import PosConfigurationManage from './pages/posconfigurations/PosConfigurationManage';
import OrderManage from './pages/orders/OrdersManage';
import CouponsTable from './pages/coupons/CouponsTable';
import CouponManage from './pages/coupons/CouponsManage';
import PolicyPagesTable from './pages/policypages/PolicyPagesTable';
import PolicyPageManage from './pages/policypages/PolicyPageManage';
import ManageSubMenu from './pages/managesubmenu/MAnageSubMenu';

function App() {
  
  const { routerPath } = CONFIG
  return (
    <AuthProvider>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Flip}
      />

      <BrowserRouter>
        <ErrorBoundary>
          <Layout>
            <SideMenu />
            <Box sx={{ display: "grid", gridTemplateRows: "70px auto 56px", height: "100vh" }}>
              <Navbar />
              <Routes>
                <Route path={`/`} element={<Navigate to="/retailcrm/admin/login" />} />
                <Route path="retailcrm">
                <Route index element={<Navigate to="admin" />} />
                  <Route path="admin">
                    <Route index element={<Navigate to="home" />} />
                    <Route path="login" element={<ErrorBoundary><Login /></ErrorBoundary>} />
                    <Route element={<ProtectedRoute />}>
                      <Route path="home" element={<ErrorBoundary><Dashboard /></ErrorBoundary>} />
                      <Route path="products" >
                        <Route index element={<ErrorBoundary><ProductsTable /></ErrorBoundary>} />
                        <Route path="add" element={<ErrorBoundary><ProductManage edit={false} heading={"ADD PRODUCT"} /></ErrorBoundary>} />
                        <Route path="edit" element={<ErrorBoundary><ProductManage edit={true} heading={"MANAGE PRODUCT"} /></ErrorBoundary>} />
                      </Route>
                      <Route path="stores" >
                        <Route index element={<ErrorBoundary><StoresTable /></ErrorBoundary>} />
                        <Route path="add" element={<ErrorBoundary><StoreManage edit={false} heading={"ADD STORE"} /></ErrorBoundary>} />
                        <Route path="edit" element={<ErrorBoundary><StoreManage edit={true} heading={"MANAGE STORE"} /></ErrorBoundary>} />
                      </Route>
                      <Route path="categories" >
                        <Route index element={<ErrorBoundary><CategoriesTable /></ErrorBoundary>} />
                        <Route path="add" element={<ErrorBoundary><CategoryManage edit={false} heading={"ADD CATEGORY"} /></ErrorBoundary>} />
                        <Route path="edit" element={<ErrorBoundary><CategoryManage edit={true} heading={"MANAGE CATEGORY"} /></ErrorBoundary>} />
                      </Route>
                      <Route path="subcategories" >
                        <Route index element={<ErrorBoundary><SubcategoriesTable /></ErrorBoundary>} />
                        <Route path="add" element={<ErrorBoundary><SubcategoryManage edit={false} heading={"ADD SUBCATEGORY"} /></ErrorBoundary>} />
                        <Route path="edit" element={<ErrorBoundary><SubcategoryManage edit={true} heading={"MANAGE SUBCATEGORY"} /></ErrorBoundary>} />
                      </Route>
                      <Route path="drivers" >
                        <Route index element={<ErrorBoundary><DriversTable /></ErrorBoundary>} />
                        <Route path="add" element={<ErrorBoundary><DriverManage edit={false} heading={"ADD DRIVER"} /></ErrorBoundary>} />
                        <Route path="edit" element={<ErrorBoundary><DriverManage edit={true} heading={"MANAGE DRIVER"} /></ErrorBoundary>} />
                      </Route>
                      <Route path="banners" >
                        <Route index element={<ErrorBoundary><BannersTable /></ErrorBoundary>} />
                        <Route path="add" element={<ErrorBoundary><BannerManage edit={false} heading={"ADD BANNER"} /></ErrorBoundary>} />
                        <Route path="edit" element={<ErrorBoundary><BannerManage edit={true} heading={"MANAGE BANNER"} /></ErrorBoundary>} />
                      </Route>
                      <Route path="coupons" >
                        <Route index element={<ErrorBoundary><CouponsTable /></ErrorBoundary>} />
                        <Route path="add" element={<ErrorBoundary><CouponManage edit={false} heading={"ADD COUPON"} /></ErrorBoundary>} />
                        <Route path="edit" element={<ErrorBoundary><CouponManage edit={true} heading={"MANAGE COUPON"} /></ErrorBoundary>} />
                      </Route>
                      <Route path="orders" >
                        <Route index element={<ErrorBoundary><OrdersTable /></ErrorBoundary>} />
                        <Route path="edit" element={<ErrorBoundary><OrderManage edit={true} heading={"ORDER DETAILS"} /></ErrorBoundary>} />
                      </Route>
                      <Route path="posconfigurations" >
                        <Route index element={<ErrorBoundary><PosConfigurationsTable /></ErrorBoundary>} />
                        <Route path="add" element={<ErrorBoundary><PosConfigurationManage edit={false} heading={"ADD POS CONFIGURATION"} /></ErrorBoundary>} />
                        <Route path="edit" element={<ErrorBoundary><PosConfigurationManage edit={true} heading={"MANAGE POS CONFIGURATIONS"} /></ErrorBoundary>} />
                      </Route>
                      <Route path="policypages" >
                        <Route index element={<ErrorBoundary><PolicyPagesTable /></ErrorBoundary>} />
                        <Route path="add" element={<ErrorBoundary><PolicyPageManage edit={false} heading={"ADD POLICY PAGE"} /></ErrorBoundary>} />
                        <Route path="edit" element={<ErrorBoundary><PolicyPageManage edit={true} heading={"MANAGE POLICY PAGES"} /></ErrorBoundary>} />
                      </Route>
                      <Route path="submenu" >
                        <Route index element={<ErrorBoundary><ManageSubMenu edit={true} heading={"MANAGE SUB MENU"} /></ErrorBoundary>} />
                      </Route>
                      <Route path="users" >
                        <Route index element={<ErrorBoundary><UsersTable /></ErrorBoundary>} />
                        <Route path="edit" element={<ErrorBoundary><UserDetails edit={true} heading={"USER DETAIL"} /></ErrorBoundary>} />
                      </Route>
                      
                      <Route path="adminusers" >
                        <Route index element={<ErrorBoundary><AdminsTable /></ErrorBoundary>} />
                        <Route path="add" element={<ErrorBoundary><AdminManage edit={false} heading={"ADD ADMIN"} /></ErrorBoundary>} />
                        <Route path="edit" element={<ErrorBoundary><AdminManage edit={true} heading={"MANAGE ADMIN"} /></ErrorBoundary>} />
                      </Route>
                    </Route>
                  </Route>
                </Route>
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
              <BottomNavbar />
            </Box>
          </Layout>
        </ErrorBoundary>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
