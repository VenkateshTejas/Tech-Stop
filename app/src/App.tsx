import { useAppDispatch, useAppSelector } from "./hooks/redux-helper";
import SpinningLoader from "./components/ui/loader";
import { Route, Routes } from "react-router-dom";
import AuthLayout from "./components/auth/Layout";
import Login from "./pages/auth/Login";
import CheckAuth from "./components/common/CheckAuth";
import { checkAuth } from "./store/auth";
import Register from "./pages/auth/Register";
import VerifyEmail from "./pages/auth/VerifyEmail";
import ResetPasswordRequest from "./pages/auth/ResetPasswordRequest";
import ResetPassword from "./pages/auth/ResetPassword";
import AdminLayout from "./components/admin-view/Layout";
import AdminDashboard from "./pages/admin-view/Dashboard";
import AdminProducts from "./pages/admin-view/Products";
import AdminOrders from "./pages/admin-view/Orders";
import AdminFeatures from "./pages/admin-view/Features";
import Unauthenticated from "./pages/unauthenticated/Unauthenticated";
import NotFound from "./pages/not-found/NotFound";
import ShoppingHome from "./pages/shopping-view/Home";
import ShoppingListing from "./pages/shopping-view/Listing";
import ShoppingLayout from "./components/shopping-view/Layout";
import ShoppingCheckout from "./pages/shopping-view/Checkout";
import ShoppingAccount from "./pages/shopping-view/Account";
import PaypalReturnPage from "./pages/shopping-view/PaypalReturnPage";
import PaymentSuccessPage from "./pages/shopping-view/PaymentSuccessPage";
import { useEffect } from "react";
import SearchProducts from "./pages/shopping-view/SearchProducts";

const App = () => {
  const { isAuthenticated, user, isLoading } = useAppSelector(
    (state) => state.auth
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (isLoading) {
    return <SpinningLoader />;
  }

  return (
    <div className="flex flex-col overflow-hidden bg-white">
      <Routes>
        {/* Index route of webpage which goes through CheckAuth route and then according to authentication and user's role redirects the user accordingly */}
        <Route
          path="/"
          element={<CheckAuth user={user} isAuthenticated={isAuthenticated} />}
        />

        {/* Auth route to perform the authentication of the user, such as login, register, verify-email, reset-password(request) and reset-password with a reset Token */}
        <Route
          path="/auth"
          element={
            <CheckAuth user={user} isAuthenticated={isAuthenticated}>
              <AuthLayout />
            </CheckAuth>
          }
        >
          <Route path="register" element={<Register />} />
          <Route path="login" element={<Login />} />
          <Route path="verify-email" element={<VerifyEmail />} />
          <Route path="reset-password" element={<ResetPasswordRequest />} />
          <Route
            path="reset-password/:resetToken"
            element={<ResetPassword />}
          />
        </Route>

        {/* Admin route that alows admin to access the dashboard page, products page and orders to manage the orders for shop */}
        <Route
          path="/admin"
          element={
            <CheckAuth user={user} isAuthenticated={isAuthenticated}>
              <AdminLayout />
            </CheckAuth>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="features" element={<AdminFeatures />} />
        </Route>

        {/* Shop route for normal users to see all the products listed and filter the products on the basis of various categories and checkout pahe and account page */}
        <Route
          path="/shop"
          element={
            <CheckAuth user={user} isAuthenticated={isAuthenticated}>
              <ShoppingLayout />
            </CheckAuth>
          }
        >
          <Route path="home" element={<ShoppingHome />} />
          <Route path="listing" element={<ShoppingListing />} />
          <Route path="checkout" element={<ShoppingCheckout />} />
          <Route path="account" element={<ShoppingAccount />} />
          <Route path="paypal-return" element={<PaypalReturnPage />} />
          <Route path="payment-success" element={<PaymentSuccessPage />} />
          <Route path="search" element={<SearchProducts />} />
        </Route>

        {/* Unauthenticated route */}
        <Route path="/unauth-page" element={<Unauthenticated />} />

        {/* Route not found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default App;
