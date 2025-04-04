import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Mağaza Bilgileri */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">
              ElectroShop
            </h3>
            <p className="text-sm mb-4">
              Elektronik ürünlerde güvenilir alışverişin adresi. Binlerce ürün,
              uygun fiyatlar ve hızlı teslimat.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-white transition-colors">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>

          {/* Hızlı Linkler */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">
              Hızlı Linkler
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Ana Sayfa
                </Link>
              </li>
              <li>
                <Link to="/menu" className="hover:text-white transition-colors">
                  Ürünler
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="hover:text-white transition-colors"
                >
                  Hakkımızda
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-white transition-colors"
                >
                  İletişim
                </Link>
              </li>
            </ul>
          </div>

          {/* İletişim Bilgileri */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">İletişim</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>İstanbul, Türkiye</span>
              </li>
              <li className="flex items-center space-x-2">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <span>info@electroshop.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <span>+90 (212) 123 45 67</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-sm text-center">
          <p>
            &copy; {new Date().getFullYear()} ElectroShop. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </footer>
  );
}
