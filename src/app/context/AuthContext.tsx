"use client";
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";

// Define types
interface AuthContextType {
  user: { userId: string; username: string; email: string } | null;
  token: string | null;
  isLoggedIn: boolean;
  login: (token: string) => void;
  logout: () => void;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider Component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthContextType["user"]>(null);
  const [token, setToken] = useState<string | null>(null);
  const isLoggedIn = !!token; // Check if token exists
  const router = useRouter();

  // Load user from localStorage on mount
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      const decodedUser = JSON.parse(atob(savedToken.split(".")[1]));
      const currentTime = Math.floor(Date.now() / 1000);
  
      if (decodedUser.exp && decodedUser.exp > currentTime) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } else {
        // Token expired 
        logout();
      }
    }
  }, []);

  // Save token & user info in state & localStorage on login
  const login = (token: string) => {
    const decodedUser = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
    setToken(token);
    setUser({ userId: decodedUser.userId, username: decodedUser.username, email: decodedUser.email });

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify({ userId: decodedUser.userId, username: decodedUser.username, email: decodedUser.email }));
  };

  // Clear auth data on logout
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/auth");
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom Hook for Auth
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
