import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cart: [],
  discount: 0,
};
const cartSlice = createSlice({
  name: "cart",
  initialState,

  reducers: {
    addToCart(state, action) {
      const { id, name, price, image } = action.payload;
      const existingProduct = state.cart.find((product) => product.id === id);

      if (existingProduct) {
        existingProduct.quantity += 1;
        existingProduct.totalPrice =
          existingProduct.quantity * existingProduct.price;
      } else {
        state.cart.push({
          id,
          name,
          price,
          image,
          quantity: 1,
          totalPrice: price,
        });
      }
    },
    removeFromCart(state, action) {
      const id = action.payload;
      const existingProduct = state.cart.find((product) => product.id === id);

      if (existingProduct.quantity === 1) {
        state.cart = state.cart.filter((product) => product.id !== id);
      } else {
        existingProduct.quantity -= 1;
      }
    },
    increaseItemQuantity(state, action) {
      const id = action.payload;
      const existingProduct = state.cart.find((product) => product.id === id);
      if (existingProduct) {
        existingProduct.quantity += 1;
        existingProduct.totalPrice =
          existingProduct.quantity * existingProduct.price;
      }
    },
    decreaseItemQuantity(state, action) {
      const id = action.payload;
      const existingProduct = state.cart.find((product) => product.id === id);
      if (existingProduct && existingProduct.quantity > 0) {
        existingProduct.quantity -= 1;
        existingProduct.totalPrice =
          existingProduct.quantity * existingProduct.price;
      }
      if (existingProduct.quantity === 0) {
        state.cart = state.cart.filter((product) => product.id !== id);
      }
    },
    clearCart(state) {
      state.cart = [];
    },
    applyDiscount(state, action) {
      state.discount = action.payload; // İndirim yüzdesini güncelle
    },
    clearDiscount(state) {
      state.discount = 0; // İndirimi sıfırla
    },
  },
});

export function getCart(state) {
  return state.cart.cart;
}

export const {
  addToCart,
  removeFromCart,
  increaseItemQuantity,
  decreaseItemQuantity,
  clearCart,
  applyDiscount,
  clearDiscount,
} = cartSlice.actions;

export default cartSlice.reducer;
