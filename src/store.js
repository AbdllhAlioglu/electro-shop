// store.js
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/user/userSlice";
import favoritesReducer from "./features/menu/favoritesSlice";
import cartReducer from "./features/cart/cartSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    favorites: favoritesReducer,
    cart: cartReducer,
  },
});

export default store; // Default export
