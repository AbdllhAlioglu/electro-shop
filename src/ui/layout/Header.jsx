import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "/assets/icons/Logo.svg";
import { useDispatch } from "react-redux";
import { logout } from "../../features/user/userSlice";
import { FaSignOutAlt, FaBars, FaTimes, FaUser } from "react-icons/fa";
import avatar from "/assets/icons/avatar.svg";
import { useAuth } from "../../context/AuthContext";
import { useLocation } from "react-router-dom";

export default function Header() {
  const { isAuthenticated } = useAuth();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  // o an hangi route'ta ise  o route'un altına padding ver

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate("/");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const getLinkClass = (path) => {
    return location.pathname === path
      ? "text-white font-bold"
      : "text-gray-200";
  };

  return (
    <header className="bg-customGreen-500 p-4 flex justify-between items-center">
      <Link
        to="/"
        className="flex items-center gap-2 text-gray-200 font-bold text-2xl"
      >
        <img src={logo} alt="Electro-Shop Logo" className="w-12 h-12" />
        <span>ElectroShop</span>
      </Link>

      {/* Mobile menu toggle button */}
      <button
        onClick={toggleMobileMenu}
        className="text-gray-200 text-2xl md:hidden"
      >
        {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Navigation menu */}
      <nav
        className={`${
          isMobileMenuOpen ? "flex" : "hidden"
        } flex-col md:flex md:flex-row md:items-center gap-4 md:gap-6 absolute md:static top-16 left-0 w-full md:w-auto bg-customGreen-500 md:bg-transparent p-4 md:p-0 z-10`}
      >
        {isAuthenticated ? (
          <>
            <Link to="/menu" className={getLinkClass("/menu")}>
              Ürünler
            </Link>
            <Link to="/favorites" className={getLinkClass("/favorites")}>
              Favoriler
            </Link>
            <Link to="/orders" className={getLinkClass("/orders")}>
              Siparişler
            </Link>
            <Link to="/cart" className={getLinkClass("/cart")}>
              Sepet
            </Link>

            <Link to="/profile" className="flex items-center gap-2">
              <img
                src={avatar}
                alt="Kullanıcı"
                className="w-8 h-8 rounded-full"
              />
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 text-gray-200 hover:underline"
            >
              <FaSignOutAlt />
              <span>Çıkış Yap</span>
            </button>
          </>
        ) : (
          <Link to="/" className="text-gray-200 flex items-center">
            <FaUser className="mr-2" />
            Giriş Yap
          </Link>
        )}
      </nav>
    </header>
  );
}
