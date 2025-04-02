import React from "react";
import { FaSort } from "react-icons/fa";

export default function SortMenu({ onSortChange }) {
  const handleSortChange = (e) => {
    onSortChange(e.target.value);
  };

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <FaSort className="text-customGreen-500" />
      </div>
      <select
        onChange={handleSortChange}
        className="appearance-none pl-10 pr-8 py-2.5 border border-gray-200 rounded-lg bg-white text-gray-700 cursor-pointer focus:ring-2 focus:ring-customGreen-100 focus:border-customGreen-200 transition-all outline-none hover:border-customGreen-200 shadow-sm font-medium"
      >
        <option value="">Sort Products</option>
        <option value="desc">Price: High to Low</option>
        <option value="asc">Price: Low to High</option>
        <option value="nameAsc">Name: A-Z</option>
        <option value="nameDesc">Name: Z-A</option>
        <option value="ratingDesc">Rating: High to Low</option>
        <option value="ratingAsc">Rating: Low to High</option>
        <option value="category">Category</option>
      </select>
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <svg
          className="w-4 h-4 text-customGreen-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  );
}
