import { supabase } from "../libs/supabase";

// Ensure consistent ID type (convert to string)
const normalizeId = (id) => String(id);

// Kullanıcı favorilerini yükleme
export async function getUserFavorites(userId) {
  try {
    if (!userId) {
      console.log("Kullanıcı ID'si eksik, favoriler yüklenemiyor");
      return [];
    }

    const { data, error } = await supabase
      .from("user_favorites")
      .select("product_id")
      .eq("user_id", userId);

    if (error) {
      console.error("Favorileri yükleme hatası:", error.message);
      throw error;
    }

    // Sadece ürün ID'lerini diziye dönüştür
    const favoriteIds = data.map((item) => normalizeId(item.product_id));
    console.log("Kullanıcı favorileri yüklendi:", favoriteIds);

    return favoriteIds;
  } catch (error) {
    console.error("getUserFavorites hatası:", error);
    return [];
  }
}

// Favori ekleme
export async function addProductToFavorites(userId, productId) {
  try {
    if (!userId) {
      console.log("Kullanıcı ID'si eksik, favori eklenemiyor");
      return false;
    }

    const normalizedId = normalizeId(productId);

    // Favori zaten var mı kontrol et
    const { data: existing, error: checkError } = await supabase
      .from("user_favorites")
      .select()
      .eq("user_id", userId)
      .eq("product_id", normalizedId);

    if (checkError) {
      console.error("Favori kontrol hatası:", checkError.message);
      throw checkError;
    }

    // Eğer favori zaten varsa ekleme yapma
    if (existing && existing.length > 0) {
      console.log("Ürün zaten favorilerde");
      return true;
    }

    // Favori ekle
    const { error } = await supabase.from("user_favorites").insert({
      user_id: userId,
      product_id: normalizedId,
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Favori ekleme hatası:", error.message);
      throw error;
    }

    console.log("Favori başarıyla eklendi:", normalizedId);
    return true;
  } catch (error) {
    console.error("addProductToFavorites hatası:", error);
    return false;
  }
}

// Favori kaldırma
export async function removeProductFromFavorites(userId, productId) {
  try {
    if (!userId) {
      console.log("Kullanıcı ID'si eksik, favori kaldırılamıyor");
      return false;
    }

    const normalizedId = normalizeId(productId);

    // Favoriyi kaldır
    const { error } = await supabase
      .from("user_favorites")
      .delete()
      .eq("user_id", userId)
      .eq("product_id", normalizedId);

    if (error) {
      console.error("Favori kaldırma hatası:", error.message);
      throw error;
    }

    console.log("Favori başarıyla kaldırıldı:", normalizedId);
    return true;
  } catch (error) {
    console.error("removeProductFromFavorites hatası:", error);
    return false;
  }
}
