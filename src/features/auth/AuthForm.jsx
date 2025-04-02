import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login, register } from "../user/userSlice";
import Button from "../../ui/Button";
import {
  FaEnvelope,
  FaLock,
  FaUser,
  FaGoogle,
  FaFacebookF,
  FaApple,
  FaSignInAlt,
  FaUserPlus,
} from "react-icons/fa";

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.user);

  const {
    register: registerForm,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    if (isLogin) {
      const resultAction = await dispatch(
        login({ email: data.email, password: data.password })
      );

      if (login.fulfilled.match(resultAction)) {
        navigate("/menu");
      }
    } else {
      const resultAction = await dispatch(
        register({
          email: data.email,
          password: data.password,
          fullName: data.fullName,
        })
      );

      if (register.fulfilled.match(resultAction)) {
        navigate("/menu");
      }
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    reset();
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="bg-white rounded-2xl overflow-hidden shadow-xl">
        {/* Form Header with Tabs */}
        <div className="grid grid-cols-2 border-b">
          <button
            className={`py-5 text-center transition-colors duration-300 font-medium text-base ${
              isLogin
                ? "bg-customGreen-600 text-white"
                : "bg-gray-100 text-gray-500 hover:text-gray-800"
            }`}
            onClick={() => {
              if (!isLogin) toggleForm();
            }}
          >
            <FaSignInAlt className="inline-block mr-2" />
            Giriş Yap
          </button>
          <button
            className={`py-5 text-center transition-colors duration-300 font-medium text-base ${
              !isLogin
                ? "bg-customGreen-600 text-white"
                : "bg-gray-100 text-gray-500 hover:text-gray-800"
            }`}
            onClick={() => {
              if (isLogin) toggleForm();
            }}
          >
            <FaUserPlus className="inline-block mr-2" />
            Üye Ol
          </button>
        </div>

        <div className="p-8">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              {isLogin ? "Hesabınıza Giriş Yapın" : "Yeni Hesap Oluşturun"}
            </h1>
            <p className="text-gray-500 text-sm">
              {isLogin
                ? "Özel teklifler ve ürünlerle elektronik alışverişinize başlayın"
                : "Hızlı ve güvenli alışveriş, sipariş takibi ve daha fazlası için üye olun"}
            </p>
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-3 mb-6">
            <button className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700">
              <FaGoogle className="text-red-500" /> Google ile{" "}
              {isLogin ? "Giriş Yap" : "Kaydol"}
            </button>
            <button className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#1877F2] rounded-lg hover:bg-[#0D6DF3] transition-colors text-sm font-medium text-white">
              <FaFacebookF /> Facebook ile {isLogin ? "Giriş Yap" : "Kaydol"}
            </button>
            <button className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-black rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium text-white">
              <FaApple /> Apple ile {isLogin ? "Giriş Yap" : "Kaydol"}
            </button>
          </div>

          <div className="relative flex items-center py-2 mb-6">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-gray-400 text-sm">
              veya e-posta ile {isLogin ? "giriş yapın" : "kaydolun"}
            </span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {!isLogin && (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-gray-400" />
                </div>
                <input
                  type="text"
                  className={`pl-10 w-full py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-customGreen-500 transition-all ${
                    errors.fullName ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Adınız ve Soyadınız"
                  {...registerForm("fullName", {
                    required: "Ad ve soyad gereklidir",
                    minLength: {
                      value: 2,
                      message: "Ad ve soyad en az 2 karakter olmalıdır",
                    },
                  })}
                />
                {errors.fullName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.fullName.message}
                  </p>
                )}
              </div>
            )}

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="text-gray-400" />
              </div>
              <input
                type="email"
                className={`pl-10 w-full py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-customGreen-500 transition-all ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="E-posta adresiniz"
                {...registerForm("email", {
                  required: "E-posta adresi gereklidir",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Geçersiz e-posta adresi",
                  },
                })}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                className={`pl-10 w-full py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-customGreen-500 transition-all ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Şifreniz"
                {...registerForm("password", {
                  required: "Şifre gereklidir",
                  minLength: {
                    value: 6,
                    message: "Şifre en az 6 karakter olmalıdır",
                  },
                })}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path
                      fillRule="evenodd"
                      d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z"
                      clipRule="evenodd"
                    />
                    <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                  </svg>
                )}
              </button>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {isLogin && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-customGreen-600 focus:ring-customGreen-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Beni hatırla
                  </label>
                </div>
                <div className="text-sm">
                  <a
                    href="#"
                    className="font-medium text-customGreen-600 hover:text-customGreen-500"
                  >
                    Şifremi unuttum
                  </a>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
                <p className="text-red-600 text-sm">
                  {error.includes("credentials")
                    ? "E-posta veya şifre hatalı"
                    : error.includes("exists")
                    ? "Bu e-posta adresi zaten kullanımda"
                    : error}
                </p>
              </div>
            )}

            <Button
              type="primary"
              className={`w-full py-3 rounded-lg bg-customGreen-600 hover:bg-customGreen-700 transition-colors ${
                status === "loading" ? "opacity-70 cursor-not-allowed" : ""
              }`}
              disabled={status === "loading"}
            >
              {status === "loading" ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  İşleniyor...
                </>
              ) : isLogin ? (
                "Giriş Yap"
              ) : (
                "Hesap Oluştur"
              )}
            </Button>
          </form>

          {!isLogin && (
            <p className="mt-6 text-xs text-center text-gray-500">
              Kaydolarak,{" "}
              <a href="#" className="text-customGreen-600">
                Kullanım Koşulları
              </a>{" "}
              ve{" "}
              <a href="#" className="text-customGreen-600">
                Gizlilik Politikası
              </a>
              &apos;nı kabul etmiş olursunuz.
            </p>
          )}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-blue-50 p-2 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-blue-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h3 className="font-medium text-gray-900">Güvenli Alışveriş</h3>
          </div>
          <p className="text-gray-500 text-sm">
            SSL şifreleme ve güvenli ödeme yöntemleriyle güvenli alışveriş
            yapın.
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-green-50 p-2 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-green-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M8 5a1 1 0 100 2h5.586l-1.293 1.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L13.586 5H8zM12 15a1 1 0 100-2H6.414l1.293-1.293a1 1 0 10-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L6.414 15H12z" />
              </svg>
            </div>
            <h3 className="font-medium text-gray-900">Kolay İade</h3>
          </div>
          <p className="text-gray-500 text-sm">
            30 gün içinde sorunsuz iade ve değişim garantisi.
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-purple-50 p-2 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-purple-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
              </svg>
            </div>
            <h3 className="font-medium text-gray-900">Özel Fırsatlar</h3>
          </div>
          <p className="text-gray-500 text-sm">
            Üyelere özel indirimler ve fırsatlardan yararlanın.
          </p>
        </div>
      </div>
    </div>
  );
}
