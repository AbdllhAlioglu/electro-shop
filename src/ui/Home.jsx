import React from "react";
import CreateUsername from "../features/user/CreateUsername";
import logo from "/assets/Logo.svg";
import { useSelector } from "react-redux";
import Button from "../ui/Button";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const username = useSelector((state) => state.user.userName);
  const navigate = useNavigate();

  function handleClick() {
    navigate("/menu");
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4 sm:px-8 md:px-16">
      {!username ? (
        <div className="flex flex-col items-center text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-700 mt-16 sm:mt-24">
            Welcome to Electro-Shop!
          </h1>
          <img
            src={logo}
            alt="Electro-Shop Logo"
            className="w-48 h-48 sm:w-64 sm:h-64 mt-8"
          />
          <CreateUsername />
        </div>
      ) : (
        <div className="flex flex-col items-center text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-700 mt-16 sm:mt-24">
            Welcome back, {username}!
          </h1>
          <img
            src={logo}
            alt="Electro-Shop Logo"
            className="w-48 h-48 sm:w-64 sm:h-64 mt-8"
          />
          <Button type="primary" onClick={handleClick} className="mt-8">
            Continue ordering
          </Button>
        </div>
      )}
    </div>
  );
}
