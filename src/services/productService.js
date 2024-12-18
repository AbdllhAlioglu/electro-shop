// services/productService.js

import store from "../store"; // Redux store'unuzu içe aktarın
import { clearCart } from "../features/cart/cartSlice";

export const getMenu = async () => {
  try {
    const response = await fetch("http://localhost:3001/products");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

const API_URL = "http://localhost:3001"; // API URL'yi projeye göre değiştirin

export async function getOrder(orderId) {
  const res = await fetch(`${API_URL}/orders/${orderId}`);
  if (!res.ok) throw new Error(`Couldn't find order #${orderId}`);

  const data = await res.json();
  return data;
}

export async function createOrder(newOrder) {
  try {
    const res = await fetch(`${API_URL}/orders`, {
      method: "POST",
      body: JSON.stringify(newOrder),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) throw new Error();
    const data = await res.json();
    store.dispatch(clearCart());
    return data;
  } catch {
    throw new Error("Failed creating your order");
  }
}
