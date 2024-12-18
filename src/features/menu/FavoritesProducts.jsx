import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromFavorites } from "../menu/favoritesSlice"; // Favori kaldırma işlemi için action
import { products } from "../../../db.json";
import Button from "../../ui/Button";
import NotFoundFavorite from "./NotFoundFavorite";
import { formatCurrency } from "../../utils/helpers";

export default function FavoritesProducts() {
  const favorites = useSelector((state) => state.favorites.favorites); // Redux store'dan favori ürünleri alıyoruz
  const dispatch = useDispatch();

  const favoriteProducts = products.filter((product) =>
    favorites.includes(product.id)
  );
  const handleRemoveFavorite = (product) => {
    dispatch(removeFromFavorites(product)); // Favori ürünü store'dan kaldır
  };

  if (favoriteProducts.length === 0) {
    return <NotFoundFavorite />;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Favori Ürünler</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {favoriteProducts.map((product) => (
          <div
            key={product.id}
            className="p-4 border rounded-lg shadow-md bg-white hover:shadow-lg transition-shadow duration-300"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-32 sm:h-40 object-contain rounded-lg mb-2"
            />
            <h2 className="text-sm sm:text-md font-semibold text-gray-800 mb-1 truncate">
              {product.name}
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 mb-2">
              {product.description}
            </p>
            <span className="text-sm font-bold text-green-600 mb-2 block">
              {formatCurrency(product.price)}
            </span>
            <Button
              onClick={() => handleRemoveFavorite(product.id)}
              type="small"
              className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-colors duration-200 text-xs sm:text-sm"
            >
              Remove
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
