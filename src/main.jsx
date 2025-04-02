import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Provider } from "react-redux";
import store from "./store.js";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";

// Environment değişkenlerini kontrol et
console.log("ENV Check:", {
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  SUPABASE_KEY: import.meta.env.VITE_SUPABASE_KEY,
  MODE: import.meta.env.MODE,
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <Toaster
          position="top-center"
          gutter={12}
          containerStyle={{ margin: "8px" }}
          toastOptions={{
            success: {
              duration: 3000,
              style: {
                background: "#4ade80",
                color: "white",
                fontWeight: "500",
                padding: "12px 16px",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              },
            },
            error: {
              duration: 3000,
              style: {
                background: "#ef4444",
                color: "white",
                fontWeight: "500",
                padding: "12px 16px",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              },
            },
            style: {
              fontSize: "14px",
              maxWidth: "400px",
            },
          }}
        />
        <App />
      </AuthProvider>
    </Provider>
  </React.StrictMode>
);
