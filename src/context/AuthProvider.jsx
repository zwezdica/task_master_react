import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          const { data } = await axios.get("/api/auth/verify");
          setUser(data.user);
          await fetchTasks();
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const fetchTasks = async () => {
    try {
      const { data } = await axios.get("/api/tasks");
      setTasks(data);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    }
  };

  const login = async (email, password) => {
    try {
      const { data } = await axios.post("/api/auth/login", { email, password });

      if (!data.token || !data.user) {
        throw new Error("Invalid response from server");
      }

      localStorage.setItem("token", data.token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
      setUser(data.user);
      await fetchTasks();

      return true;
    } catch (error) {
      console.error(
        "Login failed:",
        error.response?.data?.message || error.message
      );
      return false;
    }
  };

  const register = async (name, email, password) => {
    try {
      const { data } = await axios.post("/api/auth/register", {
        name,
        email,
        password,
      });

      localStorage.setItem("token", data.token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
      setUser(data.user);
      setTasks([]);

      return true;
    } catch (error) {
      console.error(
        "Registration failed:",
        error.response?.data?.message || error.message
      );
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
    setTasks([]);
    navigate("/");
  };

  const syncTasks = async (newTasks) => {
    try {
      await axios.post("/api/tasks/sync", { tasks: newTasks });
      setTasks(newTasks);
    } catch (error) {
      console.error("Failed to sync tasks:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        tasks,
        isLoading,
        login,
        logout,
        register,
        setTasks: syncTasks,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
