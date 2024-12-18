import React from "react";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import CartOverview from "../features/cart/CartOverview";
import { useSelector } from "react-redux";
import CreateUsername from "../features/user/CreateUsername";
import logo from "/assets/Logo.svg";

export default function AppLayout() {
  const username = useSelector((state) => state.user.userName);
  const cart = useSelector((state) => state.cart.cart);
  if (!username) {
    return (
      <div className="grid h-screen grid-rows-[auto_1fr_auto]">
        <Header />
        <div className="overflow-auto overflow-x-hidden bg-gray-200">
          <main className="mx-auto ">
            <div className="flex items-center min-h-screen flex-col ">
              <h1 className="text-4xl font-bold text-gray-700 mt-24">
                Welcome to Electro-Shop!
              </h1>
              <img src={logo} alt="Electro-Shop Logo" className="w-64 h-64" />
              <CreateUsername />
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="grid h-screen grid-rows-[auto_1fr_auto]">
      <Header />
      <div className="overflow-auto overflow-x-hidden bg-gray-200">
        <main className="mx-auto ">
          <Outlet />
        </main>
      </div>

      {cart.length > 0 && <CartOverview />}
    </div>
  );
}
