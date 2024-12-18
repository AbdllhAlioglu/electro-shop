import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "./ui/AppLayout";
import Menu, { loader as MenuLoader } from "./features/menu/Menu";
import Cart from "./features/cart/Cart";
import Home from "./ui/Home";
import FavoritesProducts from "./features/menu/FavoritesProducts";
import { loader as CartLoader } from "./features/cart/RecommendedProducts";
import Profile from "./features/user/Profile";
import OrderForm, {
  action as createOrderAction,
} from "./features/order/OrderForm";
import Order, { loader as orderLoader } from "./features/order/Order";

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
      { path: "/order/new", element: <OrderForm />, action: createOrderAction },
      {
        path: "/order/:orderId",
        element: <Order />,
        loader: orderLoader,
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
