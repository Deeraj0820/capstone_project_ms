import React, { createContext, useContext, useState, useEffect } from "react";
import { Auth, User, signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase.ts";
import { loginUser } from "../utils/auth.util.ts";

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user from Firebase on initial load
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
      // Save authentication state to localStorage
      localStorage.setItem("isAuthenticated", user ? "true" : "false");
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const user = await loginUser({ email, password });
      console.log('user', user)
      setCurrentUser(user as User);
      localStorage.setItem("isAuthenticated", "true"); // Set authenticated state
      localStorage.setItem('adminUser',JSON.stringify(user))
    } catch (error) {
      console.error("Login Error: ", error);
      throw error;
    }
  };

  const signup = async (email: string, password: string) => {
    // Implement your custom signup logic if needed
    throw new Error("Signup not implemented");
  };

  const logout = async () => {
    await signOut(auth);
    setCurrentUser(null);
    localStorage.clear();
    localStorage.setItem("isAuthenticated", "false"); // Clear authenticated state
  };

  const value = {
    currentUser,
    login,
    signup,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};