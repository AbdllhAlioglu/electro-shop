// services/productService.js

import store from "../store";
import { clearCart } from "../features/cart/cartSlice";

const API_URL =
  "https://raw.githubusercontent.com/AbdllhAlioglu/electro-data/main/db.json";

// Get menu (products)
export const getMenu = async () => {
  try {
    const response = await fetch(`${API_URL}`);
    const data = await response.json();
    return data.products; // Only return the products
  } catch (error) {
    console.error("Error fetching products:", error);
    return []; // Return an empty array on error
  }
};

// Get order by orderId
export async function getOrder(orderId) {
  try {
    const res = await fetch(`${API_URL}/orders/${orderId}`);
    if (!res.ok) throw new Error(`Couldn't find order #${orderId}`);
    const data = await res.json();
    return data; // Return the entire order data
  } catch (error) {
    console.error("Error fetching order:", error);
    throw new Error(`Error fetching order #${orderId}`);
  }
}

// Create a new order
export async function createOrder(newOrder) {
  try {
    const res = await fetch(`${API_URL}/orders`, {
      method: "POST",
      body: JSON.stringify(newOrder),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) throw new Error("Failed to create order");
    const data = await res.json();

    // Dispatch action to clear cart after order creation
    store.dispatch(clearCart());

    return data; // Return the newly created order data
  } catch (error) {
    console.error("Error creating order:", error);
    throw new Error("Failed creating your order");
  }
}
