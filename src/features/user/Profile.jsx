import React from "react";
import { useSelector } from "react-redux";
import avatar from "../../assets/avatar.svg";

export default function Profile() {
  const userName = useSelector((state) => state.user.userName);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-8">
      <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
        Profile
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profil Bilgileri */}
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
            <p className="text-lg text-gray-800">johndoe@example.com</p>
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
            <p className="text-lg text-gray-800">
              123 Main St, Springfield, IL
            </p>
          </div>
        </div>

        {/* Profil Fotoğrafı */}
        <div className="flex justify-center items-center">
          <img
            src={avatar}
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-gray-200 shadow-md"
          />
        </div>
      </div>

      {/* Düzenle Butonu */}
      <div className="flex justify-center mt-8">
        <button className="px-6 py-2 text-white bg-customGreen-500 rounded-lg hover:bg-customGreen-600 focus:outline-none focus:ring-2 focus:ring-customGreen-500 focus:ring-opacity-50">
          Edit
        </button>
      </div>
    </div>
  );
}
