import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./features/cart/cartSlice";
import orderReducer from "./features/order/orderSlice";
import userReducer from "./features/user/userSlice";
import favoritesReducer, {
  fetchUserFavorites,
  clearFavorites,
} from "./features/menu/favoritesSlice";
import { setFavoriteActions } from "./features/user/userSlice";

// Favoriler için gerekli aksiyonları ayarla
setFavoriteActions(fetchUserFavorites, clearFavorites);

// Store'u oluştur
const store = configureStore({
  reducer: {
    user: userReducer,
    favorites: favoritesReducer,
    cart: cartReducer,
    order: orderReducer,
  },
});

export default store;
