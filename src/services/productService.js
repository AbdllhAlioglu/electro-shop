// services/productService.js

import { supabase } from "../libs/supabase";
// Döngüsel bağımlılık oluşturmaması için bu import ifadesini kaldıralım
// import { getOrder, createOrder } from "./orderService";

// Get menu (products) from Supabase
export const getMenu = async () => {
  try {
    // Supabase'den ürünleri çek
    const { data: rawProducts, error } = await supabase
      .from("products")
      .select("*");

    // Eğer hata varsa
    if (error) {
      // Supabase yapılandırma kontrolü
      if (
        error.message &&
        (error.message.includes("JWT") || error.message.includes("key"))
      ) {
        throw new Error(
          "Supabase API anahtarı geçersiz veya eksik. Lütfen .env dosyanızı kontrol edin."
        );
      }

      if (error.message && error.message.includes("permission denied")) {
        throw new Error(
          "Supabase erişim hatası: Tablo erişim izinlerini (RLS) kontrol edin."
        );
      }

      // Genel hata durumunda fallback
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

    return products; // Return the products
  } catch (error) {
    // Fallback: Local JSON'dan veri çek
    try {
      const response = await fetch("db.json");
      const data = await response.json();
      return data.products;
    } catch (fallbackError) {
      return []; // Return an empty array if all fails
    }
  }
};

// Ürün stoğunu güncelle
export const updateProductStock = async (productId, quantityToReduce) => {
  try {
    // Önce ürünün mevcut stok bilgisini al
    const { data: product, error: fetchError } = await supabase
      .from("products")
      .select("stock")
      .eq("id", productId)
      .single();

    if (fetchError) {
      return false;
    }

    if (!product) {
      return false;
    }

    // Yeni stok miktarını hesapla
    const currentStock = product.stock || 0;
    const newStock = Math.max(0, currentStock - quantityToReduce); // Stok sıfırın altına düşmemeli

    // Stok bilgisini güncelle
    const { error: updateError } = await supabase
      .from("products")
      .update({ stock: newStock })
      .eq("id", productId);

    if (updateError) {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
};

// Toplu olarak ürün stoklarını güncelle
export const updateMultipleProductsStock = async (items) => {
  try {
    // Her ürün için stok güncelleme işlemi yap
    const results = await Promise.all(
      items.map((item) => updateProductStock(item.id, item.quantity))
    );

    // Tüm güncellemeler başarılı mı kontrol et
    const allSuccessful = results.every((result) => result === true);

    return allSuccessful;
  } catch (error) {
    return false;
  }
};

// Artık bu export'a gerek yok
// export { getOrder, createOrder };
