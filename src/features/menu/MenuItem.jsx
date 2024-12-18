import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaRegHeart, FaHeart } from "react-icons/fa"; // Boş ve dolu kalp ikonları
import { addToFavorites, removeFromFavorites } from "../menu/favoritesSlice";
import { formatCurrency } from "../../utils/helpers";
import { addToCart } from "../cart/cartSlice";
import { useState } from "react";
import { useEffect } from "react";

export default function MenuItem({ product }) {
  const { id, name, price, description, image, features } = product;
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.favorites.favorites);
  const cart = useSelector((state) => state.cart.cart);
  const [showCartNotification, setShowCartNotification] = useState(false);
  const [showLikeNotification, setShowLikeNotification] = useState(false);

  // Favori olup olmadığını kontrol et
  const isLiked = favorites.includes(product.id);

  const handleHeartClick = () => {
    if (isLiked) {
      dispatch(removeFromFavorites(product.id)); // id'yi çıkar
    } else {
      dispatch(addToFavorites(product.id)); // id'yi ekle
    }

    // Trigger the like notification animation
    setShowLikeNotification(true);
  };

  const handleClicked = () => {
    const existingProduct = cart.find((product) => product.id === id);

    if (existingProduct) {
      // Redux üzerinden quantity artırılır
      dispatch(
        addToCart({
          ...existingProduct,
          quantity: existingProduct.quantity + 1, // Yeni miktarı belirtiyoruz
        })
      );
    } else {
      // Yeni ürünü sepete ekler
      dispatch(addToCart({ id, name, price, image, quantity: 1 }));
    }

    // Bildirim gösterilir
    setShowCartNotification(true);
  };

  // Bildirimin otomatik olarak kaybolması
  useEffect(() => {
    if (showCartNotification) {
      const timeout = setTimeout(() => {
        setShowCartNotification(false);
      }, 3000); // 3 saniye sonra kapatılır
      return () => clearTimeout(timeout); // Temizlik işlemi
    }
  }, [showCartNotification]);

  useEffect(() => {
    if (showLikeNotification) {
      const timeout = setTimeout(() => {
        setShowLikeNotification(false);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [showLikeNotification]);

  return (
    <div className="relative max-w-sm mx-auto bg-white shadow-lg rounded-lg overflow-hidden hover:scale-105 hover:shadow-xl transition-all duration-300 min-h-[400px]">
      {showCartNotification && (
        <div className="absolute top-6 right-4 bg-customGreen-500 text-white p-2 rounded-lg shadow-lg animate-fade-left animate-once animate-duration-1000  animate-ease-linear">
          Sepete eklendi!
        </div>
      )}
      <img
        src={image}
        alt={name}
        className="w-full h-48 object-contain rounded-lg"
      />

      <div className="p-4 flex flex-col gap-2">
        <h2 className="text-lg font-bold text-gray-800 truncate">{name}</h2>
        <p className="text-sm text-gray-600 italic">{description}</p>

        {features && features.length > 0 && (
          <ul className="text-sm text-gray-700">
            {features.map((feature, index) => (
              <li key={index} className="list-disc list-inside">
                {feature}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg font-semibold text-customGreen-200">
            {formatCurrency(price)}
          </span>
          <div className="flex items-center gap-2 mb-0">
            <div
              className={`cursor-pointer transition-colors duration-200 ${
                isLiked ? "text-green-500 animate-like-heart" : "text-red-500"
              }`}
              onClick={handleHeartClick}
            >
              {isLiked ? (
                <FaHeart size={24} className="text-customGreen-200" />
              ) : (
                <FaRegHeart size={24} className="text-customGreen-200" />
              )}
            </div>
            <button
              onClick={handleClicked}
              className="bg-customGreen-500 text-white px-4 py-2 rounded-lg hover:bg-customGreen-700 transition-colors duration-200"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {showLikeNotification && (
        <div className="absolute top-6 left-2 bg-customGreen-500 text-white p-2 rounded-lg shadow-lg animate-fade-right animate-once animate-duration-1000 animate-ease-linear">
          {isLiked ? "Favorilere eklendi!" : "Favorilerden çıkarıldı!"}
        </div>
      )}
    </div>
  );
}
