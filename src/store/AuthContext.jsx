import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [isLogin, setIsLogin] = useState(() => !!localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  // 🔥 fetch user từ server
  const fetchUser = async (token) => {
    try {
      const res = await fetch("http://localhost:5000/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const data = await res.json();
      setUser(data.data);
    } catch (err) {
      console.error("Fetch user failed:", err);
      logout(); // token lỗi → logout luôn
    } finally {
      setLoading(false);
    }
  };

  // 🔥 load user khi app start
  useEffect(() => {
    const savedToken = localStorage.getItem("token");

    if (savedToken) {
      setToken(savedToken);
      setIsLogin(true);
      fetchUser(savedToken);
    } else {
      setLoading(false);
    }
  }, []);

  // 🔥 login
  const login = (token) => {
    localStorage.setItem("token", token);
    setToken(token);
    setIsLogin(true);
    fetchUser(token); // lấy user ngay sau login
  };

  // 🔥 logout
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
    setIsLogin(false);
  };

  // 🔥 gọi lại khi update profile
  const refreshUser = () => {
    if (token) fetchUser(token);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLogin,
        loading,
        login,
        logout,
        refreshUser, // 🔥 cực kỳ quan trọng
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;