import React, { useEffect, useState } from "react";
import CreateUsername from "../../features/user/CreateUsername";
import logo from "/assets/icons/Logo.svg";
import { useSelector } from "react-redux";
import Button from "../../ui/common/Button";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../libs/supabase";
import {
  FaShoppingBag,
  FaUserShield,
  FaCreditCard,
  FaHeadphones,
} from "react-icons/fa";

export default function Home() {
  const username = useSelector((state) => state.user.userName);
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch categories
        const { data: categoryData, error } = await supabase
          .from("products")
          .select("category")
          .limit(100);

        if (error) {
          throw error;
        }

        // Güvenli bir şekilde kategorileri kontrol et
        if (categoryData && Array.isArray(categoryData)) {
          // Extract unique categories
          const uniqueCategories = [
            ...new Set(categoryData.map((item) => item.category)),
          ]
            .filter(Boolean)
            .slice(0, 6); // null/undefined değerleri filtrele ve 6 kategori ile sınırla

          setCategories(uniqueCategories);
        } else {
          // Veri yoksa boş array ayarla
          setCategories([]);
        }
      } catch (error) {
        // Hata durumunda boş array ile devam et
        setCategories([]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  function handleClick() {
    navigate("/menu");
  }

  function navigateToCategory(category) {
    navigate(`/menu?category=${category}`);
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-customGreen-600 border-t-transparent"></div>
        <span className="ml-3 text-gray-600">Yükleniyor...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 rounded-xl">
      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-customGreen-900 to-customGreen-700 text-white rounded-xl">
        <div className="container mx-auto max-w-6xl px-4 py-16 md:py-20 ">
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
              <div className="hidden md:block relative"></div>
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
