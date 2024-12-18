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
    <div>
      {!username ? (
        <div className="flex items-center min-h-screen flex-col ">
          <h1 className="text-4xl font-bold text-gray-700 mt-24">
            Welcome to Electro-Shop!
          </h1>
          <img src={logo} alt="Electro-Shop Logo" className="w-64 h-64" />
          <CreateUsername />
        </div>
      ) : (
        <div className="flex items-center min-h-screen flex-col ">
          <h1 className="text-4xl font-bold text-gray-700 mt-24">
            Welcome back, {username}!
          </h1>
          <img src={logo} alt="Electro-Shop Logo" className="w-64 h-64" />
          <Button type="primary" onClick={handleClick}>
            Continue ordering
          </Button>
        </div>
      )}
    </div>
  );
}

/* <h1 className="text-4xl font-bold text-gray-700 mt-24">
        Welcome to Electro-Shop!
      </h1>
      <img src={logo} alt="Electro-Shop Logo" className="w-64 h-64" />
      <CreateUsername />  */
