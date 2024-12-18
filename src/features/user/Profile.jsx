import React from "react";
import { useSelector } from "react-redux";
import avatar from "/assets/avatar.svg";
import Button from "../../ui/Button";

export default function Profile() {
  const userName = useSelector((state) => state.user.userName);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-8">
      <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
        Profile
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Username
            </label>
            <p className="text-lg text-gray-800">{userName}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">
              Email
            </label>
            <p className="text-lg text-gray-800">aliogluuabdullah@gmail.com</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">
              Phone
            </label>
            <p className="text-lg text-gray-800">+1 234 567 890</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">
              Address
            </label>
            <p className="text-lg text-gray-800">Istanbul</p>
          </div>
        </div>

        <div className="flex justify-center items-center">
          <img
            src={avatar}
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-gray-200 shadow-md"
          />
        </div>
      </div>

      <div className="flex justify-center mt-8">
        <Button type="small">Edit</Button>
      </div>
    </div>
  );
}
