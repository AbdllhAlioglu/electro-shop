import React from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    toast.error("Bu sayfayı görüntülemek için giriş yapmanız gerekiyor", {
      icon: "🔒",
      duration: 4000,
    });
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
}
