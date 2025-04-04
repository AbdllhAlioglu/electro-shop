import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Provider } from "react-redux";
import store from "./store.js";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <Toaster
          position="top-center"
          gutter={12}
          containerClassName="toast-container"
          toastOptions={{
            success: {
              duration: 3000,
              style: {
                background: "#ffffff",
                color: "#31473A",
                fontWeight: "500",
                padding: "12px 16px",
                borderLeft: "4px solid #31473A",
                borderRadius: "4px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.12)",
              },
              icon: "✓",
            },
            error: {
              duration: 2000,
              style: {
                background: "#ffffff",
                color: "#e53e3e",
                fontWeight: "500",
                padding: "12px 16px",
                borderLeft: "4px solid #e53e3e",
                borderRadius: "4px",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.12)",
              },
            },
            style: {
              fontSize: "14px",
              maxWidth: "400px",
              padding: "12px 16px",
            },
          }}
        />
        <App />
      </AuthProvider>
    </Provider>
  </React.StrictMode>
);
