import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "./ui/AppLayout";
import Menu, { loader as MenuLoader } from "./features/menu/Menu";
import Cart from "./features/cart/Cart";
import Home from "./ui/Home";
import FavoritesProducts from "./features/menu/FavoritesProducts";
import { loader as CartLoader } from "./features/cart/RecommendedProducts";
import Profile from "./features/user/Profile";
import ProfileEdit from "./features/user/ProfileEdit";
import OrderForm, {
  action as createOrderAction,
} from "./features/order/OrderForm";
import Order, { loader as orderLoader } from "./features/order/Order";
import Orders, { loader as ordersLoader } from "./features/order/Orders";
import { Toaster } from "react-hot-toast";

const router = createBrowserRouter([
  {
    element: <AppLayout />, // This is the parent layout
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/menu",
        element: <Menu />,
        loader: MenuLoader,
      },
      { path: "/cart", element: <Cart />, loader: CartLoader },
      { path: "/favorites", element: <FavoritesProducts /> },
      { path: "/profile", element: <Profile /> },
      { path: "/profile/edit", element: <ProfileEdit /> },
      { path: "/order/new", element: <OrderForm />, action: createOrderAction },
      {
        path: "/order/:orderId",
        element: <Order />,
        loader: orderLoader,
      },
      {
        path: "/orders",
        element: <Orders />,
        loader: ordersLoader,
      },
    ],
  },
]);

export default function App() {
  return (
    <>
      <Toaster
        position="top-center"
        gutter={12}
        containerStyle={{ margin: "8px" }}
        toastOptions={{
          success: {
            duration: 5000,
            style: {
              background: "#4ade80",
              color: "white",
              fontWeight: "500",
            },
          },
          error: {
            duration: 5000,
            style: {
              background: "#ef4444",
              color: "white",
              fontWeight: "500",
            },
          },
          style: {
            fontSize: "16px",
            maxWidth: "500px",
            padding: "16px 24px",
          },
        }}
      />
      <RouterProvider router={router} />
    </>
  );
}
