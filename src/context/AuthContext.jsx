import React, { createContext, useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSession } from "../features/user/userSlice";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const { user, status, error } = useSelector((state) => state.user);

  useEffect(() => {
    // Check for existing session on app load
    dispatch(getSession());
  }, [dispatch]);

  const isAuthenticated = !!user;
  const isLoading = status === "loading";

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
