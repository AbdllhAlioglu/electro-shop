import { createSlice } from "@reduxjs/toolkit";

// Başlangıç durumu
const initialState = {
  favorites: [],
};

// Slice oluşturuluyor
const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    addToFavorites: (state, action) => {
      // Ürün zaten favorilerde değilse id ekle
      if (!state.favorites.includes(action.payload)) {
        state.favorites.push(action.payload); // id ekleniyor
      }
    },
    removeFromFavorites: (state, action) => {
      // Ürünü id ile favorilerden çıkar
      state.favorites = state.favorites.filter((id) => id !== action.payload);
    },
  },
});

// Action'lar ve reducer'lar export ediliyor
export const { addToFavorites, removeFromFavorites } = favoritesSlice.actions;

export default favoritesSlice.reducer;
