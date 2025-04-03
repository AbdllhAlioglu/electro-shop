import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getUserFavorites,
  addProductToFavorites,
  removeProductFromFavorites,
} from "../../services/favoriteService";

// Ensure consistent ID type (convert to string)
const normalizeId = (id) => String(id);

// LocalStorage'dan favorileri yükle
const loadFavoritesFromStorage = () => {
  try {
    const storedFavorites = localStorage.getItem("favorites");
    return {
      favorites: storedFavorites ? JSON.parse(storedFavorites) : [],
      status: "idle",
      error: null,
    };
  } catch (error) {
    return {
      favorites: [],
      status: "idle",
      error: null,
    };
  }
};

// LocalStorage'e favorileri kaydet
const saveFavoritesToStorage = (favorites) => {
  try {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  } catch (error) {
    // Hata olursa sessizce devam et
  }
};

// Async thunk to fetch user favorites
export const fetchUserFavorites = createAsyncThunk(
  "favorites/fetchUserFavorites",
  async (_, { rejectWithValue, getState }) => {
    try {
      const userId = getState().user?.user?.id;
      if (!userId) {
        // Kullanıcı giriş yapmamışsa, localStorage'dan favorileri döndür
        const localFavorites = localStorage.getItem("favorites");
        return localFavorites ? JSON.parse(localFavorites) : [];
      }
      const favorites = await getUserFavorites(userId);
      // Veritabanından çekilen favorileri localStorage'a da kaydet
      saveFavoritesToStorage(favorites);
      return favorites;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to add a product to favorites
export const addToFavoritesAsync = createAsyncThunk(
  "favorites/addToFavoritesAsync",
  async (productId, { rejectWithValue, getState }) => {
    try {
      const userId = getState().user?.user?.id;
      if (!userId) {
        // Kullanıcı giriş yapmamışsa, sadece localStorage'a ekle
        const localFavorites = localStorage.getItem("favorites");
        const favorites = localFavorites ? JSON.parse(localFavorites) : [];
        const normalizedId = normalizeId(productId);

        if (!favorites.map(normalizeId).includes(normalizedId)) {
          favorites.push(normalizedId);
          saveFavoritesToStorage(favorites);
        }
        return normalizedId;
      }

      const success = await addProductToFavorites(userId, productId);
      if (success) {
        return normalizeId(productId);
      }
      return rejectWithValue("Favori eklenemedi");
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to remove a product from favorites
export const removeFromFavoritesAsync = createAsyncThunk(
  "favorites/removeFromFavoritesAsync",
  async (productId, { rejectWithValue, getState }) => {
    try {
      const userId = getState().user?.user?.id;
      if (!userId) {
        // Kullanıcı giriş yapmamışsa, sadece localStorage'dan çıkar
        const localFavorites = localStorage.getItem("favorites");
        const favorites = localFavorites ? JSON.parse(localFavorites) : [];
        const normalizedId = normalizeId(productId);

        const updatedFavorites = favorites.filter(
          (id) => normalizeId(id) !== normalizedId
        );
        saveFavoritesToStorage(updatedFavorites);
        return normalizedId;
      }

      const success = await removeProductFromFavorites(userId, productId);
      if (success) {
        return normalizeId(productId);
      }
      return rejectWithValue("Favori kaldırılamadı");
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Başlangıç durumu
const initialState = loadFavoritesFromStorage();

// Slice oluşturuluyor
const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    addToFavorites: (state, action) => {
      const normalizedId = normalizeId(action.payload);

      // Ürün zaten favorilerde değilse id ekle
      if (!state.favorites.map(normalizeId).includes(normalizedId)) {
        state.favorites.push(normalizedId); // id ekleniyor
        saveFavoritesToStorage(state.favorites);
      }
    },
    removeFromFavorites: (state, action) => {
      const normalizedId = normalizeId(action.payload);

      // Ürünü id ile favorilerden çıkar
      state.favorites = state.favorites.filter(
        (id) => normalizeId(id) !== normalizedId
      );
      saveFavoritesToStorage(state.favorites);
    },
    // Kullanıcı çıkış yaptığında favorileri temizle
    clearFavorites: (state) => {
      state.favorites = [];
      saveFavoritesToStorage(state.favorites);
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch favorites cases
      .addCase(fetchUserFavorites.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserFavorites.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.favorites = action.payload;
        saveFavoritesToStorage(state.favorites);
      })
      .addCase(fetchUserFavorites.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Add to favorites cases
      .addCase(addToFavoritesAsync.fulfilled, (state, action) => {
        const normalizedId = action.payload;
        if (!state.favorites.map(normalizeId).includes(normalizedId)) {
          state.favorites.push(normalizedId);
          saveFavoritesToStorage(state.favorites);
        }
      })
      // Remove from favorites cases
      .addCase(removeFromFavoritesAsync.fulfilled, (state, action) => {
        const normalizedId = action.payload;
        state.favorites = state.favorites.filter(
          (id) => normalizeId(id) !== normalizedId
        );
        saveFavoritesToStorage(state.favorites);
      });
  },
});

// Action'lar ve reducer'lar export ediliyor
export const { addToFavorites, removeFromFavorites, clearFavorites } =
  favoritesSlice.actions;

export default favoritesSlice.reducer;
