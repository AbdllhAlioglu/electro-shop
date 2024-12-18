import React from "react";
import { useSelector } from "react-redux";

export default function Username() {
  const username = useSelector((state) => state.user.userName);

  return <p className="text-gray-200 font-semibold">{username}</p>;
}
