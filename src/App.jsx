import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "./ui/layout/AppLayout";
import Menu, { loader as MenuLoader } from "./features/menu/Menu";
import Cart from "./features/cart/Cart";
import Home from "./ui/pages/Home";
import FavoritesProducts from "./features/menu/FavoritesProducts";
import { loader as CartLoader } from "./features/cart/RecommendedProducts";
import Profile from "./features/user/Profile";
import ProfileEdit from "./features/user/ProfileEdit";
import OrderForm, {
  action as createOrderAction,
} from "./features/order/OrderForm";
import Order, { loader as orderLoader } from "./features/order/Order";
import Orders, { loader as ordersLoader } from "./features/order/Orders";
import ProtectedRoute from "./ui/ProtectedRoute";
import PageNotFound from "./ui/pages/PageNotFound";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
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
      {
        path: "/favorites",
        element: (
          <ProtectedRoute>
            <FavoritesProducts />
          </ProtectedRoute>
        ),
      },
      {
        path: "/profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "/profile/edit",
        element: (
          <ProtectedRoute>
            <ProfileEdit />
          </ProtectedRoute>
        ),
      },
      {
        path: "/order/new",
        element: (
          <ProtectedRoute>
            <OrderForm />
          </ProtectedRoute>
        ),
        action: createOrderAction,
      },
      {
        path: "/order/:orderId",
        element: (
          <ProtectedRoute>
            <Order />
          </ProtectedRoute>
        ),
        loader: orderLoader,
      },
      {
        path: "/orders",
        element: (
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        ),
        loader: ordersLoader,
      },
      {
        path: "*",
        element: <PageNotFound />,
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
