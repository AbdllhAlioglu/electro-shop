import React, { useEffect, useState, useRef } from "react";
import CreateUsername from "../features/user/CreateUsername";
import logo from "/assets/Logo.svg";
import { useSelector } from "react-redux";
import Button from "../ui/Button";
import { useNavigate } from "react-router-dom";
import { supabase } from "../libs/supabase";
import { formatCurrency } from "../utils/helpers";
import {
  FaShoppingBag,
  FaArrowRight,
  FaStar,
  FaTags,
  FaBolt,
  FaUserShield,
  FaCreditCard,
  FaHeadphones,
  FaChevronRight,
  FaChevronLeft,
} from "react-icons/fa";

export default function Home() {
  const username = useSelector((state) => state.user.userName);
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [specialOffers, setSpecialOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trendingProducts, setTrendingProducts] = useState([]);

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    hours: 8,
    minutes: 24,
    seconds: 53,
  });

  // Tab state for products
  const [activeTab, setActiveTab] = useState("flash");

  // References for product scrolling
  const productsContainerRef = useRef(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch featured products
        const { data: featuredData } = await supabase
          .from("products")
          .select("*")
          .order("rating", { ascending: false })
          .limit(6);

        // Fetch categories
        const { data: categoryData } = await supabase
          .from("products")
          .select("category")
          .limit(100);

        // Extract unique categories
        const uniqueCategories = [
          ...new Set(categoryData.map((item) => item.category)),
        ].slice(0, 6); // Limit to 6 categories

        // Fetch special offers
        const { data: offersData } = await supabase
          .from("products")
          .select("*")
          .order("price", { ascending: true })
          .limit(4);

        // Fetch trending products (newest products)
        const { data: trendingData } = await supabase
          .from("products")
          .select("*")
          .order("id", { ascending: false })
          .limit(6);

        setFeaturedProducts(featuredData || []);
        setCategories(uniqueCategories || []);
        setSpecialOffers(offersData || []);
        setTrendingProducts(trendingData || []);
      } catch (error) {
        console.error("Error fetching home page data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();

    // Set up countdown timer
    const countdownInterval = setInterval(() => {
      setTimeLeft((prevTime) => {
        const newSeconds = prevTime.seconds - 1;

        if (newSeconds >= 0) {
          return { ...prevTime, seconds: newSeconds };
        } else {
          const newMinutes = prevTime.minutes - 1;

          if (newMinutes >= 0) {
            return { ...prevTime, minutes: newMinutes, seconds: 59 };
          } else {
            const newHours = prevTime.hours - 1;

            if (newHours >= 0) {
              return { hours: newHours, minutes: 59, seconds: 59 };
            } else {
              // Reset the timer when it reaches zero
              return { hours: 23, minutes: 59, seconds: 59 };
            }
          }
        }
      });
    }, 1000);

    // Clean up the interval on component unmount
    return () => clearInterval(countdownInterval);
  }, []);

  function handleClick() {
    navigate("/menu");
  }

  function navigateToCategory(category) {
    navigate(`/menu?category=${category}`);
  }

  function navigateToProduct(productId) {
    navigate(`/product/${productId}`);
  }

  function scrollProducts(direction) {
    if (productsContainerRef.current) {
      const scrollAmount = direction === "left" ? -400 : 400;
      productsContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-customGreen-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-customGreen-900 to-customGreen-700 text-white">
        <div className="container mx-auto max-w-6xl px-4 py-16 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="inline-block px-4 py-1 bg-white/20 rounded-full text-sm font-medium mb-4">
                Yeni Teknoloji, En İyi Fiyatlar
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4">
                {username
                  ? `${username}, Teknoloji Tutkunlarının Buluşma Noktası`
                  : "En İyi Elektronik Ürünler Tek Çatı Altında"}
              </h1>
              <p className="text-white/80 text-lg mb-8 max-w-lg">
                Son teknoloji ürünleri, akıllı ev sistemlerinden güçlü
                bilgisayarlara kadar tüm ihtiyaçlarınız için ElectroShop&apos;a
                hoş geldiniz.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  type="primary"
                  onClick={handleClick}
                  className="bg-white text-customGreen-800 hover:bg-opacity-90 px-6 py-3 font-medium"
                >
                  <FaShoppingBag className="inline-block mr-2" /> Alışverişe
                  Başla
                </Button>
                <Button
                  type="primary"
                  onClick={() => navigate("/menu?category=Bilgisayar")}
                  className="bg-transparent border-2 border-white hover:bg-white/10 px-6 py-3 font-medium"
                >
                  Öne Çıkan Ürünler
                </Button>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-customGreen-500 rounded-full blur-2xl opacity-20"></div>
                <img
                  src="/assets/hero-device.png"
                  alt="Smart Device"
                  className="relative z-10 max-w-sm"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = logo;
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Pills */}
      <section className="py-8 px-4 bg-white shadow-sm">
        <div className="container mx-auto max-w-6xl overflow-x-auto hide-scrollbar">
          <div className="flex gap-3 min-w-max pb-2">
            <button
              onClick={() => navigate("/menu")}
              className="whitespace-nowrap px-5 py-2 rounded-full bg-customGreen-600 text-white font-medium text-sm"
            >
              Tüm Ürünler
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => navigateToCategory(category)}
                className="whitespace-nowrap px-5 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium text-sm transition-colors"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Create Username Section (if not logged in) */}
      {!username && (
        <section className="py-10 px-4 bg-white mt-8 rounded-xl mx-4 md:mx-auto max-w-6xl shadow-sm">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="md:w-1/2">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Üyelik Avantajlarına Hemen Erişin
              </h2>
              <p className="text-gray-600 mb-4">
                Özel fırsatlar, indirim kuponları ve daha fazlası için üye olun.
                Sipariş takibi ve favorilere ekleme özelliklerini
                kullanabilirsiniz.
              </p>
            </div>
            <div className="md:w-1/2 w-full bg-gray-50 p-6 rounded-lg">
              <CreateUsername />
            </div>
          </div>
        </section>
      )}

      {/* Unified Products Section with Tabs */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {/* Tab Headers */}
            <div className="flex border-b">
              <button
                onClick={() => setActiveTab("flash")}
                className={`flex items-center gap-2 px-6 py-4 font-medium text-base transition-colors ${
                  activeTab === "flash"
                    ? "text-customGreen-600 border-b-2 border-customGreen-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <FaBolt
                  className={
                    activeTab === "flash" ? "text-amber-500" : "text-gray-400"
                  }
                />
                Flaş İndirimler
                <div className="ml-2 flex items-center text-xs">
                  <span className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded">
                    {timeLeft.hours}
                  </span>
                  <span className="mx-0.5">:</span>
                  <span className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded">
                    {timeLeft.minutes.toString().padStart(2, "0")}
                  </span>
                  <span className="mx-0.5">:</span>
                  <span className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded">
                    {timeLeft.seconds.toString().padStart(2, "0")}
                  </span>
                </div>
              </button>
              <button
                onClick={() => setActiveTab("popular")}
                className={`flex items-center gap-2 px-6 py-4 font-medium text-base transition-colors ${
                  activeTab === "popular"
                    ? "text-customGreen-600 border-b-2 border-customGreen-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <FaStar
                  className={
                    activeTab === "popular" ? "text-amber-500" : "text-gray-400"
                  }
                />
                Popüler Ürünler
              </button>
              <button
                onClick={() => setActiveTab("new")}
                className={`flex items-center gap-2 px-6 py-4 font-medium text-base transition-colors ${
                  activeTab === "new"
                    ? "text-customGreen-600 border-b-2 border-customGreen-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <FaTags
                  className={
                    activeTab === "new" ? "text-blue-500" : "text-gray-400"
                  }
                />
                Yeni Gelenler
              </button>
              <div className="ml-auto flex items-center px-4">
                <button
                  onClick={handleClick}
                  className="text-customGreen-600 hover:text-customGreen-700 text-sm font-medium flex items-center"
                >
                  Tümünü Gör <FaArrowRight className="ml-1" size={12} />
                </button>
              </div>
            </div>

            {/* Tab Content with Navigation Arrows */}
            <div className="relative p-6">
              <button
                onClick={() => scrollProducts("left")}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-md p-2 text-gray-500 hover:text-customGreen-600"
              >
                <FaChevronLeft />
              </button>

              <div
                ref={productsContainerRef}
                className="overflow-x-auto pb-4 hide-scrollbar"
              >
                {/* Flash Deals */}
                {activeTab === "flash" && (
                  <div className="flex gap-4 min-w-max">
                    {specialOffers.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => navigateToProduct(product.id)}
                        className="bg-white border border-gray-100 rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-all w-80"
                      >
                        <div className="relative h-52 bg-gray-50">
                          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            -%
                            {Math.round(
                              ((product.price * 0.2) / product.price) * 100
                            )}
                          </span>
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-contain p-4"
                          />
                        </div>
                        <div className="p-4">
                          <div className="flex items-center gap-1 mb-1">
                            <FaStar className="text-amber-400 text-xs" />
                            <span className="text-xs text-gray-500">
                              {product.rating}
                            </span>
                          </div>
                          <h3 className="font-medium text-gray-900 mb-2 line-clamp-1">
                            {product.name}
                          </h3>
                          <p className="text-gray-500 text-sm mb-3 line-clamp-2">
                            {product.description}
                          </p>
                          <div className="flex items-end justify-between">
                            <div>
                              <p className="text-customGreen-600 font-bold text-xl">
                                {formatCurrency(product.price * 0.8)}
                              </p>
                              <p className="text-gray-400 line-through text-sm">
                                {formatCurrency(product.price)}
                              </p>
                            </div>
                            <Button
                              type="small"
                              className="bg-customGreen-600 text-white hover:bg-customGreen-700"
                            >
                              Sepete Ekle
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Popular Products */}
                {activeTab === "popular" && (
                  <div className="flex gap-4 min-w-max">
                    {featuredProducts.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => navigateToProduct(product.id)}
                        className="bg-white border border-gray-100 rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-all w-64"
                      >
                        <div className="relative h-48 bg-gray-50">
                          <div className="absolute top-2 right-2">
                            <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full font-medium">
                              Popüler
                            </span>
                          </div>
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-contain p-4"
                          />
                        </div>
                        <div className="p-4">
                          <div className="flex items-center gap-1 mb-1">
                            <FaStar className="text-amber-400 text-xs" />
                            <span className="text-xs text-gray-500">
                              {product.rating}
                            </span>
                          </div>
                          <h3 className="font-medium text-gray-900 mb-2 line-clamp-1">
                            {product.name}
                          </h3>
                          <div className="flex items-center justify-between">
                            <p className="font-bold text-customGreen-600">
                              {formatCurrency(product.price)}
                            </p>
                            <Button
                              type="small"
                              className="text-xs py-1 px-2 bg-customGreen-600 text-white"
                            >
                              Sepete Ekle
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* New Products */}
                {activeTab === "new" && (
                  <div className="flex gap-4 min-w-max">
                    {trendingProducts.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => navigateToProduct(product.id)}
                        className="bg-white border border-gray-100 rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-all w-56"
                      >
                        <div className="relative h-40 bg-gray-50">
                          <div className="absolute top-2 right-2">
                            <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-medium">
                              Yeni
                            </span>
                          </div>
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-contain p-4"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="font-medium text-gray-900 mb-1 line-clamp-1">
                            {product.name}
                          </h3>
                          <p className="text-customGreen-600 font-bold">
                            {formatCurrency(product.price)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => scrollProducts("right")}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-md p-2 text-gray-500 hover:text-customGreen-600"
              >
                <FaChevronRight />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-12 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Neden ElectroShop?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-lg">
              <div className="rounded-full bg-customGreen-100 p-3 text-customGreen-600">
                <FaCreditCard size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Güvenli Ödeme</h3>
                <p className="text-gray-600 text-sm">
                  128-bit SSL şifreleme ile güvenli ödeme seçenekleri. Kredi
                  kartı, havale ve kapıda ödeme imkanı.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-lg">
              <div className="rounded-full bg-blue-100 p-3 text-blue-600">
                <FaUserShield size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">
                  Orijinal Ürünler
                </h3>
                <p className="text-gray-600 text-sm">
                  Tüm ürünlerimiz %100 orijinal ve garantilidir. Yetkili
                  distribütörlerden temin edilmektedir.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-lg">
              <div className="rounded-full bg-purple-100 p-3 text-purple-600">
                <FaHeadphones size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">7/24 Destek</h3>
                <p className="text-gray-600 text-sm">
                  Müşteri hizmetleri ekibimiz tüm sorularınız için 7/24
                  hizmetinizdedir.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="bg-customGreen-600 rounded-lg overflow-hidden shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-8 text-white">
                <h2 className="text-2xl font-bold mb-4">
                  İndirimlerden İlk Siz Haberdar Olun
                </h2>
                <p className="text-customGreen-50 mb-6">
                  Bültenimize abone olarak en yeni ürünleri ve özel teklifleri
                  kaçırmayın. Yeni abonelere özel %10 indirim fırsatı!
                </p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Email adresiniz"
                    className="px-4 py-3 rounded focus:outline-none flex-grow bg-white/90 text-gray-800 placeholder-gray-500"
                  />
                  <Button
                    type="primary"
                    className="bg-white text-customGreen-600 hover:bg-customGreen-50 whitespace-nowrap"
                  >
                    Abone Ol
                  </Button>
                </div>
              </div>
              <div className="hidden md:block relative">
                <img
                  src="/assets/newsletter-cover.jpg"
                  alt="Campaign"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://via.placeholder.com/500x300/164e38/FFFFFF?text=ElectroShop+Kampanya";
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brands - Redesigned with Logos */}
      <section className="py-14 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-12">
            Marka Ortaklarımız
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
            {[
              {
                name: "Apple",
                logo: "/assets/logos/apple-logo.png",
                fallback: "A",
              },
              {
                name: "Samsung",
                logo: "/assets/logos/samsung-logo.png",
                fallback: "S",
              },
              {
                name: "Sony",
                logo: "/assets/logos/sony-logo.svg",
                fallback: "S",
              },
              { name: "LG", logo: "/assets/logos/lg-logo.svg", fallback: "L" },
              {
                name: "Huawei",
                logo: "/assets/logos/huawei-logo.svg",
                fallback: "H",
              },
              {
                name: "Asus",
                logo: "/assets/logos/asus-logo.svg",
                fallback: "A",
              },
            ].map((brand) => (
              <div
                key={brand.name}
                className="flex flex-col items-center justify-center"
              >
                <div className="bg-gray-50 p-4 rounded-lg h-20 w-32 flex items-center justify-center overflow-hidden mb-2">
                  <img
                    src={brand.logo}
                    alt={`${brand.name} logo`}
                    className="max-h-full max-w-full object-contain"
                    onError={(e) => {
                      e.target.onerror = null;
                      // Fallback to a styled div with the first letter
                      e.target.parentNode.innerHTML = `<div className="flex items-center justify-center h-full w-full font-bold text-2xl text-customGreen-600">${brand.fallback}</div>`;
                    }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-600">
                  {brand.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

/* Yardımcı CSS */
/*
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
*/
