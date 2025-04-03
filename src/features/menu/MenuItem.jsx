import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FaRegHeart,
  FaHeart,
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaShoppingCart,
  FaTags,
} from "react-icons/fa";
import {
  addToFavoritesAsync,
  removeFromFavoritesAsync,
} from "../menu/favoritesSlice";
import { formatCurrency } from "../../utils/helpers";
import { addToCart } from "../cart/cartSlice";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

// Ensure consistent ID type (convert to string)
const normalizeId = (id) => String(id);

// formatFeatures fonksiyonunu tanımla
function formatFeatures(features) {
  // Eğer features string ise JSON olarak parse etmeyi dene
  if (typeof features === "string") {
    try {
      return JSON.parse(features);
    } catch (error) {
      // JSON değilse virgülle ayrılmış liste olarak kabul et
      return features.split(",").map((item) => item.trim());
    }
  }

  // Halihazırda array ise olduğu gibi döndür
  if (Array.isArray(features)) {
    return features;
  }

  // Hiçbiri değilse boş array döndür
  return [];
}

export default function MenuItem({ product }) {
  const {
    id,
    name,
    price,
    description,
    image,
    category,
    rating,
    features: rawFeatures,
    stock = 0, // Default to 0 if stock is not provided
  } = product;

  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();
  const favorites = useSelector((state) => state.favorites.favorites);
  const cart = useSelector((state) => state.cart.cart);
  const [showCartNotification, setShowCartNotification] = useState(false);
  const [showLikeNotification, setShowLikeNotification] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isProcessingFavorite, setIsProcessingFavorite] = useState(false);
  const navigate = useNavigate();

  // Features'ı array formatına dönüştür
  const features = React.useMemo(() => {
    if (!rawFeatures) return [];

    // Eğer zaten array ise
    if (Array.isArray(rawFeatures)) return rawFeatures;

    // Eğer string ise ve JSON formatında ise
    try {
      if (typeof rawFeatures === "string") {
        return JSON.parse(rawFeatures);
      }
    } catch (error) {
      // JSON değilse virgülle ayrılmış liste olarak kabul et
      return rawFeatures.split(",").map((item) => item.trim());
    }

    // Eğer string ama JSON formatında değilse veya başka bir tip ise
    if (typeof rawFeatures === "string") {
      return rawFeatures.split(",").map((item) => item.trim());
    }

    return [];
  }, [rawFeatures]);

  // Normalize all favorite IDs
  const normalizedFavorites = favorites.map(normalizeId);

  // Favori olup olmadığını kontrol et
  const isLiked = normalizedFavorites.includes(normalizeId(id));

  // Stock status check
  const isOutOfStock = stock === 0;
  const getStockStatus = () => {
    if (isOutOfStock)
      return { text: "Stokta Yok", className: "bg-red-100 text-red-800" };
    if (stock <= 20)
      return { text: "Son Birkaç Ürün", className: "bg-red-100 text-red-800" };
    if (stock <= 50)
      return {
        text: "Sınırlı Stok",
        className: "bg-yellow-100 text-yellow-800",
      };
    return { text: "Stokta Mevcut", className: "bg-green-100 text-green-800" };
  };

  const stockStatus = getStockStatus();

  const handleHeartClick = async () => {
    if (!isAuthenticated) {
      // Kullanıcı giriş yapmadıysa bildirim göster
      alert("Favorilere eklemek için giriş yapmalısınız.");
      return;
    }

    if (isProcessingFavorite) return; // İşlem zaten devam ediyorsa çık

    setIsProcessingFavorite(true);

    try {
      if (isLiked) {
        await dispatch(removeFromFavoritesAsync(id)).unwrap();
      } else {
        await dispatch(addToFavoritesAsync(id)).unwrap();
      }

      // Trigger the like notification animation
      setShowLikeNotification(true);
    } catch (error) {
      console.error("Favori işlemi hatası:", error);
      alert("Favori işlemi gerçekleştirilemedi: " + error);
    } finally {
      setIsProcessingFavorite(false);
    }
  };

  const handleAddToCart = () => {
    const existingProduct = cart.find((item) => item.id === id);

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

  // Generate rating stars
  const renderRatingStars = (rating) => {
    // Eğer rating tanımlı değilse veya geçerli bir sayı değilse boş dizi döndür
    if (rating === undefined || rating === null || isNaN(rating)) return [];

    // Rating değerini 0-5 aralığında sınırla
    const validRating = Math.max(0, Math.min(5, rating));

    const stars = [];
    const fullStars = Math.floor(validRating);
    const hasHalfStar = validRating % 1 !== 0;

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`star-${i}`} className="text-yellow-400" />);
    }

    // Add half star if needed
    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half-star" className="text-yellow-400" />);
    }

    // Add empty stars
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="text-yellow-400" />);
    }

    return stars;
  };

  return (
    <div
      className="relative h-full flex flex-col bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Notification Badges */}
      {showCartNotification && (
        <div className="absolute top-4 right-4 z-30 bg-customGreen-500 text-white px-3 py-1.5 rounded-lg shadow-lg animate-fade-left">
          Sepete Eklendi
        </div>
      )}

      {showLikeNotification && (
        <div className="absolute top-4 left-4 z-30 bg-customGreen-500 text-white px-3 py-1.5 rounded-lg shadow-lg animate-fade-right">
          {isLiked ? "Favorilere Eklendi" : "Favorilerden Kaldırıldı"}
        </div>
      )}

      {/* Image Container with Aspect Ratio */}
      <div className="relative pt-[75%] overflow-hidden bg-gray-50">
        {/* Category Badge */}
        {category && (
          <div className="absolute top-3 left-3 z-10">
            <span className="inline-flex items-center gap-1 bg-customGreen-100/90 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1.5 rounded-md shadow-sm">
              <FaTags className="text-xs" />
              {category}
            </span>
          </div>
        )}

        {/* Favorite Button */}
        <button
          onClick={handleHeartClick}
          className="absolute top-3 right-3 z-10 bg-white p-2 rounded-full shadow-md hover:shadow-lg transition-all"
        >
          {isLiked ? (
            <FaHeart className="text-red-500 text-lg" />
          ) : (
            <FaRegHeart className="text-gray-400 hover:text-red-500 text-lg" />
          )}
        </button>

        {/* Product Image */}
        <img
          src={image}
          alt={name}
          className={`absolute inset-0 w-full h-full object-contain p-4  transform transition-all duration-300  ${
            isHovered ? "scale-110" : "scale-100"
          }`}
        />
      </div>

      {/* Product Information */}
      <div className="flex flex-col flex-grow p-5">
        {/* Title and Rating */}
        <div className="mb-2">
          <h3 className="font-semibold text-gray-800 text-lg h-14 line-clamp-2">
            {name}
          </h3>

          {/* Rating */}
          {rating ? (
            <div className="flex items-center mt-2">
              <div className="flex mr-2">{renderRatingStars(rating)}</div>
              <span className="text-sm text-gray-500">{rating.toFixed(1)}</span>
            </div>
          ) : (
            <div className="flex items-center mt-2 h-5">
              <span className="text-sm text-gray-400">No rating</span>
            </div>
          )}
        </div>

        {/* Short Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-grow">
          {description}
        </p>

        {/* Features */}
        {features && features.length > 0 && (
          <div className="mb-4">
            <ul className="text-xs text-gray-600 space-y-1.5">
              {features.slice(0, 3).map((feature, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-1.5 mt-0.5 text-customGreen-500 flex-shrink-0">
                    ✓
                  </span>
                  <span className="line-clamp-1">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Price and Add to Cart */}
        <div className="mt-auto pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xl font-bold text-customGreen-500">
              {formatCurrency(price)}
            </p>

            {/* Stock Indicator */}
            <span
              className={`text-xs px-2 py-1 rounded-full ${stockStatus.className}`}
            >
              {stockStatus.text}
            </span>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`w-full py-2.5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-customGreen-300 focus:ring-opacity-50 flex items-center justify-center gap-2
              ${
                isOutOfStock
                  ? "bg-gray-300 cursor-not-allowed text-gray-500"
                  : "bg-customGreen-500 text-white hover:bg-customGreen-600"
              }`}
          >
            <FaShoppingCart />
            <span>{isOutOfStock ? "Stokta Yok" : "Sepete Ekle"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
