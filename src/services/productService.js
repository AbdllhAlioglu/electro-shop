// services/productService.js

import { supabase } from "../libs/supabase";
import { getOrder, createOrder } from "./orderService";

// Get menu (products) from Supabase
export const getMenu = async () => {
  try {
    console.log("Fetching products from Supabase...");

    // Supabase'den ürünleri çek
    const { data: rawProducts, error } = await supabase
      .from("products")
      .select("*");

    // Eğer hata varsa
    if (error) {
      console.error("Error fetching products from Supabase:", error);

      // API anahtarı hatası mı kontrol et
      if (error.message.includes("Invalid API key")) {
        console.error(
          "API anahtarı geçersiz. Lütfen Supabase projenizden doğru anahtarı kopyalayıp kontrol edin."
        );
      }

      // Tablo erişim hatası mı kontrol et
      if (error.message.includes("permission denied")) {
        console.error(
          "Tablo erişim hatası. RLS (Row Level Security) ayarlarınızı kontrol edin."
        );
      }

      // Fallback: Local JSON'dan veri çek
      console.log("Falling back to local data...");
      const response = await fetch("db.json");
      const data = await response.json();
      return data.products;
    }

    // Supabase'den gelen verileri formatla
    const products = rawProducts.map((product) => {
      // features alanını doğru formata dönüştür
      let features = product.features;

      // Eğer features string ise ve JSON formatında ise
      if (typeof features === "string") {
        try {
          features = JSON.parse(features);
        } catch (error) {
          // JSON parse edilemezse, virgülle ayrılmış liste olarak kabul et
          features = features.split(",").map((item) => item.trim());
        }
      }

      // Eğer features hala array değilse, boş array olarak ayarla
      if (!Array.isArray(features)) {
        features = [];
      }

      return {
        ...product,
        features,
      };
    });

    console.log("Successfully fetched products:", products?.length);
    return products; // Return the products
  } catch (error) {
    console.error("Error fetching products:", error);
    // Fallback: Local JSON'dan veri çek
    try {
      const response = await fetch("db.json");
      const data = await response.json();
      return data.products;
    } catch (fallbackError) {
      console.error("Fallback also failed:", fallbackError);
      return []; // Return an empty array if all fails
    }
  }
};

// sipariş işlevleri için orderService.js'e yönlendirme
export { getOrder, createOrder };
