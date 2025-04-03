import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserFavorites,
  removeFromFavoritesAsync,
} from "../menu/favoritesSlice";
import { Link } from "react-router-dom";
import { supabase } from "../../libs/supabase";
import NotFoundFavorite from "./NotFoundFavorite";
import { formatCurrency } from "../../utils/helpers";
import { addToCart } from "../cart/cartSlice";
import toast from "react-hot-toast";
import Button from "../../ui/common/Button";
import { normalizeId } from "../../utils/helpers";

export default function FavoritesProducts() {
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.favorites.favorites);
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Favorileri Redux'tan yükle
  useEffect(() => {
    dispatch(fetchUserFavorites());
  }, [dispatch]);

  // Favorilere ait ürünleri getir
  async function fetchFavoriteProducts() {
    if (!favorites.length) {
      setFavoriteProducts([]);
      setIsLoading(false);
      return;
    }

    try {
      // Normalize all favorite IDs
      const normalizedFavorites = favorites.map(normalizeId);

      // Fetch products from Supabase that match favorite IDs
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .in("id", normalizedFavorites);

      if (error) {
        setFavoriteProducts([]);
        setIsLoading(false);
        return;
      }

      setFavoriteProducts(data);
    } catch (error) {
      setFavoriteProducts([]);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchFavoriteProducts();
  }, [favorites]);

  const handleRemoveFavorite = async (productId) => {
    try {
      await dispatch(removeFromFavoritesAsync(productId));
      toast.success("Ürün favorilerden kaldırıldı");
    } catch (error) {
      toast.error("İşlem sırasında bir hata oluştu");
    }
  };

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    toast.success(`${product.name} sepete eklendi!`);
  };

  if (isLoading) {
    return (
      <div className="py-10">
        <p className="text-center text-lg">Favoriler yükleniyor...</p>
      </div>
    );
  }

  if (favoriteProducts.length === 0) {
    return <NotFoundFavorite />;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Favori Ürünlerim</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {favoriteProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 transition-all hover:shadow-lg"
          >
            <Link to={`/menu/${product.id}`}>
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
            </Link>
            <div className="p-4">
              <Link to={`/menu/${product.id}`}>
                <h2 className="text-lg font-semibold mb-2 hover:text-customGreen-600">
                  {product.name}
                </h2>
              </Link>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {product.description?.substring(0, 100)}
                {product.description?.length > 100 ? "..." : ""}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-customGreen-700 font-bold">
                  {formatCurrency(product.price)}
                </span>
                <button
                  onClick={() => handleRemoveFavorite(product.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </button>
              </div>
              <Button
                type="primary"
                className="w-full mt-3"
                onClick={() => handleAddToCart(product)}
              >
                Sepete Ekle
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
