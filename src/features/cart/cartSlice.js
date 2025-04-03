import { createSlice } from "@reduxjs/toolkit";

// LocalStorage'dan sepet verilerini yükle
const loadCartFromStorage = () => {
  try {
    const storedCart = localStorage.getItem("cart");
    const storedDiscount = localStorage.getItem("discount");
    return {
      cart: storedCart ? JSON.parse(storedCart) : [],
      discount: storedDiscount ? Number(storedDiscount) : 0,
    };
  } catch (error) {
    return {
      cart: [],
      discount: 0,
    };
  }
};

// LocalStorage'e sepet verilerini kaydet
const saveCartToStorage = (cart, discount) => {
  try {
    localStorage.setItem("cart", JSON.stringify(cart));
    localStorage.setItem("discount", String(discount));
  } catch (error) {
    // Hata olursa sessizce devam et
  }
};

const initialState = loadCartFromStorage();

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
      saveCartToStorage(state.cart, state.discount);
    },
    removeFromCart(state, action) {
      const id = action.payload;
      const existingProduct = state.cart.find((product) => product.id === id);

      if (existingProduct.quantity === 1) {
        state.cart = state.cart.filter((product) => product.id !== id);
      } else {
        existingProduct.quantity -= 1;
      }
      saveCartToStorage(state.cart, state.discount);
    },
    increaseItemQuantity(state, action) {
      const id = action.payload;
      const existingProduct = state.cart.find((product) => product.id === id);
      if (existingProduct) {
        existingProduct.quantity += 1;
        existingProduct.totalPrice =
          existingProduct.quantity * existingProduct.price;
      }
      saveCartToStorage(state.cart, state.discount);
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
      saveCartToStorage(state.cart, state.discount);
    },
    clearCart(state) {
      state.cart = [];
      state.discount = 0;
      saveCartToStorage(state.cart, state.discount);
    },
    applyDiscount(state, action) {
      state.discount = action.payload; // İndirim yüzdesini güncelle
      saveCartToStorage(state.cart, state.discount);
    },
    clearDiscount(state) {
      state.discount = 0; // İndirimi sıfırla
      saveCartToStorage(state.cart, state.discount);
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
