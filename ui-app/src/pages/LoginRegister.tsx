import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginRegister.css";

interface LoginRegisterProps {
  setIsAuthenticated: (value: boolean) => void;
}

const LoginRegister: React.FC<LoginRegisterProps> = ({ setIsAuthenticated }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const fetchUserInfo = async () => {
    try {
      const token = sessionStorage.getItem("accessToken");
      if (!token) {
        throw new Error("Token is missing. Please log in again.");
      }

      const response = await fetch("http://localhost:8000/api/userinfo", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("username", data.username);
        localStorage.setItem("email", data.email);
      } else {
        throw new Error("Failed to fetch user info.");
      }
    } catch (err) {
      console.error("Error fetching user info:", err);
      alert("Something went wrong while fetching user details. Please try again.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const endpoint = isLogin
      ? "http://localhost:8000/api/login"
      : "http://localhost:8000/api/register";

    const body = isLogin
      ? { username: formData.username, password: formData.password }
      : { username: formData.username, email: formData.email, password: formData.password };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const data = await response.json();

        if (isLogin) {
          sessionStorage.setItem("accessToken", data.access);
          sessionStorage.setItem("refreshToken", data.refresh);
          await fetchUserInfo(); 
          setIsAuthenticated(true);
          navigate("/"); 
        } else {
          alert("Registered successfully! You can now log in.");
          setIsLogin(true);
        }
      } else {
        const errorData = await response.json();
        setError(errorData.detail || "An error occurred. Please check your input.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-tabs">
          <button
            className={`auth-tab ${isLogin ? "active" : ""}`}
            onClick={() => setIsLogin(true)}
          >
            Zaloguj się
          </button>
          <button
            className={`auth-tab ${!isLogin ? "active" : ""}`}
            onClick={() => setIsLogin(false)}
          >
            Załóż konto
          </button>
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="auth-input"
          />
          {!isLogin && (
            <input
              type="email"
              name="email"
              placeholder="E-mail"
              value={formData.email}
              onChange={handleChange}
              className="auth-input"
            />
          )}
          <input
            type="password"
            name="password"
            placeholder="Hasło"
            value={formData.password}
            onChange={handleChange}
            className="auth-input"
          />
          {error && <p className="auth-error">{error}</p>}
          <button type="submit" className="auth-button">
            {isLogin ? "Zaloguj się" : "Zarejestruj się"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginRegister;
