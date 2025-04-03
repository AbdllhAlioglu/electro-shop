import React from "react";
import { Link } from "react-router-dom";

function PageNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-6 bg-gradient-to-b from-white to-gray-100">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border border-gray-100 animate-fade-in">
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <svg
              className="w-40 h-40 text-red-500"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h1 className="text-7xl font-extrabold text-red-500 mb-2 animate-pulse">
            404
          </h1>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Sayfa Bulunamadı
          </h2>
          <div className="h-1 w-20 bg-red-500 mx-auto rounded-full mb-6"></div>
        </div>

        <p className="mb-8 text-gray-600">
          Aradığınız sayfa mevcut değil veya taşınmış olabilir. Lütfen başka bir
          sayfaya gitmeyi deneyin.
        </p>

        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="bg-gray-800 hover:bg-gray-900 text-white py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105 flex items-center justify-center"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7m-14 0l2 2m0 0l7 7-7-7m14 0l-2-2m0 0l-7-7-7 7m14 0l-2 2m0 0l-7 7 7-7"
              />
            </svg>
            Ana Sayfaya Dön
          </Link>

          <Link
            to="/menu"
            className="border border-gray-300 bg-white hover:bg-gray-50 text-gray-800 py-3 px-6 rounded-lg transition duration-300 transform hover:scale-105 flex items-center justify-center"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
            Menüye Git
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default PageNotFound;
