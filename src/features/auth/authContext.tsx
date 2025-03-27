import React, { createContext, useContext, useState, useEffect } from "react";
import { Client, LoginUserRequest } from "../../API/IdentityApi";
import { jwtDecode } from "jwt-decode";

interface AuthContextType {
  token: string | null;
  user: any | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isTokenExpired: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null);

  const isTokenExpired = (): boolean => {
    if (!token) return true;
    try {
      const decoded = jwtDecode<any>(token);
      const currentTime = Date.now() / 1000;
      const isExpred = decoded.exp < currentTime;
      if (isExpred) {
        localStorage.removeItem("token");
      }
      return isExpred;
    } catch (error) {
      console.error("Invalid token:", error);
      return true;
    }
  };

  // Load token from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      try {
        const decoded = jwtDecode<any>(storedToken);
        setUser(decoded);
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("token");
        setToken(null);
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const apiClient = new Client("http://localhost:6001");
      const request = new LoginUserRequest();
      request.email = email;
      request.password = password;
      const response = await apiClient.login(request);
      const jwtToken = response.token;
      if (!jwtToken) throw new Error("No token received");
      localStorage.setItem("token", jwtToken);
      setToken(jwtToken);
      const decoded = jwtDecode<any>(jwtToken);
      setUser(decoded);
    } catch (error) {
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
      throw new Error(error instanceof Error ? error.message : "Unknown error");
    }
  };

  const loginWithGoogle = async (googleToken: string) => {
    try {
      const apiClient = new Client("http://localhost:6001");
      const response = await apiClient.loginWithGoogle(googleToken);
      const jwtToken = response.token;
      if (!jwtToken) throw new Error("No token received");
      localStorage.setItem("token", jwtToken);
      setToken(jwtToken);
      const decoded = jwtDecode<any>(jwtToken);
      setUser(decoded);
    } catch (error) {
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
      throw new Error(error instanceof Error ? error.message : "Unknown error");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ token, user, login, logout, isTokenExpired }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
