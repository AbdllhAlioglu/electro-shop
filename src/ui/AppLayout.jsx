import React from "react";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import CartOverview from "../features/cart/CartOverview";
import { useSelector } from "react-redux";
import logo from "/assets/Logo.svg";
import { useAuth } from "../context/AuthContext";
import AuthForm from "../features/auth/AuthForm";

export default function AppLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  const cart = useSelector((state) => state.cart.cart);

  if (isLoading) {
    return (
      <div className="grid h-screen grid-rows-[auto_1fr_auto] overflow-x-hidden">
        <Header />
        <div className="overflow-x-hidden overflow-y-auto bg-gray-50">
          <main className="mx-auto">
            <div className="flex items-center min-h-screen justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-2 border-customGreen-600 border-t-transparent"></div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="grid h-screen grid-rows-[auto_1fr_auto] overflow-x-hidden">
        <Header />
        <div className="overflow-x-hidden overflow-y-auto bg-gray-50">
          <main className="max-w-full min-h-screen">
            <div className="container mx-auto px-4 py-10">
              {/* Hero Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 items-start">
                {/* Left Column - Branding and Welcome */}
                <div className="flex flex-col items-center md:items-start">
                  <div className="text-center md:text-left mb-8">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
                      Elektronik Alışverişin
                      <br />
                      Yeni Adresi
                    </h1>
                    <p className="text-gray-600 text-lg max-w-lg">
                      ElectroShop&apos;a hoş geldiniz! Binlerce ürün, özel
                      indirimler ve hızlı teslimat ile elektronik alışverişin
                      keyfini çıkarın.
                    </p>
                  </div>

                  <div className="relative w-64 h-64 mb-8">
                    <div className="absolute inset-0 bg-customGreen-100 rounded-full opacity-20"></div>
                    <img
                      src={logo}
                      alt="Electro-Shop Logo"
                      className="absolute inset-0 w-full h-full object-contain p-4"
                    />
                  </div>

                  <div className="bg-white p-6 rounded-lg shadow-sm w-full max-w-md">
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">
                      Neden Üye Olmalısınız?
                    </h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <svg
                          className="h-5 w-5 text-customGreen-500 mt-0.5 flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                        <span className="text-gray-600">
                          Siparişlerinizi kolayca takip edin
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <svg
                          className="h-5 w-5 text-customGreen-500 mt-0.5 flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                        <span className="text-gray-600">
                          Özel indirimlerden ve fırsatlardan yararlanın
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <svg
                          className="h-5 w-5 text-customGreen-500 mt-0.5 flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                        <span className="text-gray-600">
                          Favori ürünlerinizi kaydedin
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <svg
                          className="h-5 w-5 text-customGreen-500 mt-0.5 flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                        <span className="text-gray-600">
                          Daha hızlı alışveriş deneyimi yaşayın
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Right Column - Authentication Form */}
                <div className="sticky top-8">
                  <AuthForm />
                </div>
              </div>

              {/* Featured Categories Section */}
              <div className="mt-16">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                  Popüler Kategoriler
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {[
                    "Akıllı Telefonlar",
                    "Bilgisayarlar",
                    "Televizyonlar",
                    "Kulaklıklar",
                    "Tabletler",
                    "Kameralar",
                  ].map((category) => (
                    <div
                      key={category}
                      className="bg-white rounded-lg p-4 text-center shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <div className="w-12 h-12 bg-customGreen-50 rounded-full flex items-center justify-center mx-auto mb-3">
                        <span className="text-customGreen-600 font-bold text-lg">
                          {category.charAt(0)}
                        </span>
                      </div>
                      <p className="font-medium text-gray-800">{category}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="grid h-screen grid-rows-[auto_1fr_auto] overflow-x-hidden">
      <Header />
      <div className="overflow-x-hidden overflow-y-auto bg-gray-50">
        <main className="mx-4 sm:mx-8 md:mx-16 max-w-full">
          <Outlet />
        </main>
      </div>

      {cart.length > 0 && <CartOverview />}
    </div>
  );
}
