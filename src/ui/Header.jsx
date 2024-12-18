import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/Logo.svg";
import { useSelector, useDispatch } from "react-redux";
import { resetName } from "../features/user/userSlice";
import { FaSignOutAlt } from "react-icons/fa";
import avatar from "../assets/avatar.svg";

export default function Header() {
  const username = useSelector((state) => state.user.userName);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    dispatch(resetName());
    navigate("/");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="bg-customGreen-500 p-4 flex justify-around items-center">
      <Link
        to="/"
        className="text-gray-200 tracking-widest font-bold text-2xl flex items-center gap-2"
      >
        <img src={logo} alt="Electro-Shop Logo" className="w-12 h-12" />
        <span className="text-gray-200 tracking-widest font-bold text-2xl font-roboto">
          Electro-Shop
        </span>
      </Link>
      {username ? (
        <div className="flex items-center gap-4">
          <Link to="/menu" className="text-gray-200">
            Menu
          </Link>
          <Link to="/favorites" className="text-gray-200">
            Favorites
          </Link>
          <Link to="/cart" className="text-gray-200">
            Cart
          </Link>

          {/* Dropdown for Profile */}
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="flex items-center gap-2 text-gray-200 focus:outline-none"
            >
              <img src={avatar} alt="User" className="w-8 h-8 rounded-full" />
              <span>{username}</span>
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-10">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div>
          <Link to="/" className="text-gray-200 flex items-center">
            <FaSignOutAlt className="mr-2" />
            Giriş Yap
          </Link>
        </div>
      )}
    </header>
  );
}
