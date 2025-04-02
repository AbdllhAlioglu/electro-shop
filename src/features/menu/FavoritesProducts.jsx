import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  removeFromFavoritesAsync,
  fetchUserFavorites,
} from "../menu/favoritesSlice";
import { supabase } from "../../libs/supabase";
import Button from "../../ui/Button";
import NotFoundFavorite from "./NotFoundFavorite";
import { formatCurrency } from "../../utils/helpers";
import { useAuth } from "../../context/AuthContext";

// Ensure consistent ID type (convert to string)
const normalizeId = (id) => String(id);

export default function FavoritesProducts() {
  const { isAuthenticated } = useAuth();
  const favorites = useSelector((state) => state.favorites.favorites);
  const dispatch = useDispatch();
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [removingItems, setRemovingItems] = useState(new Set());

  // Kullanıcı oturumunu kontrol et ve favorileri yükle
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchUserFavorites());
    }
  }, [isAuthenticated, dispatch]);

  // Favoriler güncellendiğinde ürünleri getir
  useEffect(() => {
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
          console.error("Ürünleri yükleme hatası:", error);
          throw error;
        }

        if (data) {
          setFavoriteProducts(data);
        } else {
          setFavoriteProducts([]);
        }
      } catch (error) {
        console.error("Favori ürünleri yükleme hatası:", error);
        setFavoriteProducts([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchFavoriteProducts();
  }, [favorites]);

  const handleRemoveFavorite = async (productId) => {
    // Aynı ürün için işlem devam ediyorsa çık
    if (removingItems.has(productId)) return;

    try {
      // İşlem başladığını belirt
      setRemovingItems((prev) => new Set([...prev, productId]));

      // Favorilerden kaldır
      await dispatch(removeFromFavoritesAsync(productId)).unwrap();
    } catch (error) {
      console.error("Favori kaldırma hatası:", error);
      alert("Favori kaldırılamadı: " + error);
    } finally {
      // İşlem bittiğini belirt
      setRemovingItems((prev) => {
        const newSet = new Set([...prev]);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  // Yükleme ekranı
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-lg font-medium text-gray-600">
          Favoriler yükleniyor...
        </div>
      </div>
    );
  }

  // Favori yoksa
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
              disabled={removingItems.has(product.id)}
            >
              {removingItems.has(product.id)
                ? "Kaldırılıyor..."
                : "Favorilerden Çıkar"}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
