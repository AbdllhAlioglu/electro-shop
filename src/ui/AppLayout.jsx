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
        <div className="overflow-x-hidden overflow-y-auto bg-gray-200">
          <main className="mx-4 sm:mx-8 md:mx-16 max-w-full">
            <div className="flex items-center min-h-screen flex-col text-center">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-700 mt-16 sm:mt-24">
                Welcome to Electro-Shop!
              </h1>
              <img
                src={logo}
                alt="Electro-Shop Logo"
                className="w-48 h-48 sm:w-64 sm:h-64 mt-8 max-w-full"
              />
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
      <div className="overflow-x-hidden overflow-y-auto bg-gray-200">
        <main className="mx-4 sm:mx-8 md:mx-16 max-w-full">
          <Outlet />
        </main>
      </div>

      {cart.length > 0 && <CartOverview />}
    </div>
  );
}
