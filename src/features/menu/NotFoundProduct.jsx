import React from "react";
import { FaSearch, FaSadTear } from "react-icons/fa";

export default function NotFoundProduct() {
  return (
    <div className="py-16 px-4 text-center">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-10 max-w-md mx-auto">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-50 text-customGreen-500 mb-6">
          <FaSearch size={28} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-3">
          No Products Found
        </h2>
        <p className="text-gray-600 mb-8 leading-relaxed">
          We couldn&apos;t find any products matching your search criteria. Try
          adjusting your filters or search terms.
        </p>

        <div className="flex justify-center items-center gap-2 text-gray-500">
          <FaSadTear className="text-yellow-400" />
          <span>Please try a different search</span>
        </div>

        <div className="h-1 w-20 bg-customGreen-200 mx-auto rounded-full mt-8"></div>
      </div>
    </div>
  );
}
