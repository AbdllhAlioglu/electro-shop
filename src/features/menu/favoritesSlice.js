import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getUserFavorites,
  addProductToFavorites,
  removeProductFromFavorites,
} from "../../services/favoriteService";

// Ensure consistent ID type (convert to string)
const normalizeId = (id) => String(id);

// Async thunk to fetch user favorites
export const fetchUserFavorites = createAsyncThunk(
  "favorites/fetchUserFavorites",
  async (_, { rejectWithValue, getState }) => {
    try {
      const userId = getState().user?.user?.id;
      if (!userId) {
        return [];
      }
      const favorites = await getUserFavorites(userId);
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
        return rejectWithValue("Kullanıcı giriş yapmamış");
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
        return rejectWithValue("Kullanıcı giriş yapmamış");
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
const initialState = {
  favorites: [],
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

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
      }
    },
    removeFromFavorites: (state, action) => {
      const normalizedId = normalizeId(action.payload);

      // Ürünü id ile favorilerden çıkar
      state.favorites = state.favorites.filter(
        (id) => normalizeId(id) !== normalizedId
      );
    },
    // Kullanıcı çıkış yaptığında favorileri temizle
    clearFavorites: (state) => {
      state.favorites = [];
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
        }
      })
      // Remove from favorites cases
      .addCase(removeFromFavoritesAsync.fulfilled, (state, action) => {
        const normalizedId = action.payload;
        state.favorites = state.favorites.filter(
          (id) => normalizeId(id) !== normalizedId
        );
      });
  },
});

// Action'lar ve reducer'lar export ediliyor
export const { addToFavorites, removeFromFavorites, clearFavorites } =
  favoritesSlice.actions;

export default favoritesSlice.reducer;
