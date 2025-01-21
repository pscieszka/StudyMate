import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import "./LoginRegister.css";

interface LoginRegisterProps {
    setIsAuthenticated: (value: boolean) => void;
}

const LoginRegister: React.FC<LoginRegisterProps> = ({setIsAuthenticated}) => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({...formData, [e.target.name]: e.target.value});
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

        if (!isLogin && formData.password.length < 8) {
            setError("Hasło musi mieć co najmniej 8 znaków.");
            return;
        }
        const endpoint = isLogin
            ? "http://localhost:8000/api/login"
            : "http://localhost:8000/api/register";

        const body = isLogin
            ? {username: formData.username, password: formData.password}
            : {username: formData.username, email: formData.email, password: formData.password};

        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
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
                const responseBody = await response.text();
                let errorData;
                try {
                    errorData = JSON.parse(responseBody);
                } catch (err) {
                    console.error("Error parsing JSON:", err);
                }
                console.log("Error data:", errorData);

                if (errorData && errorData.username) {
                    if (errorData.username.includes("A user with that username already exists.")) {
                        setError("A user with that username already exists.");
                        return;
                    }
                }
                if (errorData && errorData.email) {
                    if (errorData.email.includes("user with this email already exists.")) {
                        setError("A user with this email already exists.");
                        return;
                    } else if (errorData.email.includes("Enter a valid email address.")) {
                        setError("Enter a valid email address  example@example.com");
                        return;
                    }
                }
                if (errorData && errorData.detail && typeof errorData.detail === "string" && errorData.detail.includes("No active account found with the given credentials")) {
                    setError("User does not exist or incorrect password.");
                    return;
                }
                setError("An error occurred. Please check your input.");
                return;
            }
        } catch (err) {
            console.error("Error during fetch:", err); // Logowanie błędu
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
                    <div className="input-container">
                        <i className="fa-solid fa-user input-icon"></i>
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={formData.username}
                            onChange={handleChange}
                            className="auth-input"
                            required
                        />
                    </div>
                    {!isLogin && (
                        <div className="input-container">
                            <i className="fa-solid fa-envelope input-icon"></i>
                            <input
                                type="email"
                                name="email"
                                placeholder="E-mail"
                                value={formData.email}
                                onChange={handleChange}
                                className="auth-input"
                                required
                            />
                        </div>
                    )}
                    <div className="input-container">
                        <i className="fa-solid fa-lock input-icon"></i>
                        <input
                            type="password"
                            name="password"
                            placeholder="Hasło"
                            value={formData.password}
                            onChange={handleChange}
                            className="auth-input"
                            required
                        />
                    </div>
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
