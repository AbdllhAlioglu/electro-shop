import { supabase } from "../libs/supabase";

// ID tipini normalize et (string'e çevir)
const normalizeId = (id) => String(id);

// Kullanıcının favorilerini getir
export async function getUserFavorites(userId) {
  try {
    if (!userId) {
      return [];
    }

    // Kullanıcının favorilerini al
    const { data, error } = await supabase
      .from("user_favorites")
      .select("product_id")
      .eq("user_id", userId);

    if (error) {
      return [];
    }

    // Sadece ürün ID'lerini içeren bir array dön
    const favoriteIds = data.map((item) => normalizeId(item.product_id));
    return favoriteIds;
  } catch (error) {
    return [];
  }
}

// Ürün favorilere ekle
export async function addProductToFavorites(userId, productId) {
  try {
    if (!userId) {
      return false;
    }

    const normalizedId = normalizeId(productId);

    // Önce ürünün zaten favori olup olmadığını kontrol et
    const { data: existingFavorites, error: checkError } = await supabase
      .from("user_favorites")
      .select("id")
      .eq("user_id", userId)
      .eq("product_id", normalizedId);

    if (checkError) {
      return false;
    }

    // Ürün zaten favorilerdeyse, tekrar eklemeye gerek yok
    if (existingFavorites && existingFavorites.length > 0) {
      return true;
    }

    // Ürünü favorilere ekle
    const { error } = await supabase.from("user_favorites").insert({
      user_id: userId,
      product_id: normalizedId,
      created_at: new Date().toISOString(),
    });

    if (error) {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
}

// Ürünü favorilerden kaldır
export async function removeProductFromFavorites(userId, productId) {
  try {
    if (!userId) {
      return false;
    }

    const normalizedId = normalizeId(productId);

    // Ürünü favorilerden kaldır
    const { error } = await supabase
      .from("user_favorites")
      .delete()
      .eq("user_id", userId)
      .eq("product_id", normalizedId);

    if (error) {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
}
