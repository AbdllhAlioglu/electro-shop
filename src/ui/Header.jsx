import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "/assets/Logo.svg";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/user/userSlice";
import { FaSignOutAlt, FaBars, FaTimes, FaUser } from "react-icons/fa";
import avatar from "/assets/avatar.svg";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { isAuthenticated } = useAuth();
  const username = useSelector((state) => state.user.userName);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate("/");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-customGreen-500 p-4 flex justify-between items-center">
      <Link
        to="/"
        className="flex items-center gap-2 text-gray-200 font-bold text-2xl"
      >
        <img src={logo} alt="Electro-Shop Logo" className="w-12 h-12" />
        <span>Electro-Shop</span>
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
            <Link to="/menu" className="text-gray-200">
              Menu
            </Link>
            <Link to="/favorites" className="text-gray-200">
              Favorites
            </Link>
            <Link to="/orders" className="text-gray-200">
              Orders
            </Link>
            <Link to="/cart" className="text-gray-200">
              Cart
            </Link>
            <Link to="/profile" className="flex items-center gap-2">
              <img src={avatar} alt="User" className="w-8 h-8 rounded-full" />
              <span className="text-gray-200">{username}</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 text-gray-200 hover:underline"
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </>
        ) : (
          <Link to="/" className="text-gray-200 flex items-center">
            <FaUser className="mr-2" />
            Login
          </Link>
        )}
      </nav>
    </header>
  );
}
