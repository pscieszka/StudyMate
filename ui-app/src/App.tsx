import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";  // Importuj GoogleOAuthProvider
import Navbar from "./components/Navbar";
import Add from "./pages/Add";
import Account from "./pages/Account";
import Home from "./pages/Home";
import SubjectAds from "./pages/SubjectAds";
import LoginRegister from "./pages/LoginRegister";
import PrivateRoute from "./components/PrivateRoute";
import Favorites from "./pages/Favorites";
import EditAd from "./pages/EditAd";
import SwaggerDocumentation from "./pages/SwaggerUI";
import "./App.css";

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
        !!sessionStorage.getItem("accessToken")
    );

    const handleLogout = () => {
        sessionStorage.removeItem("accessToken");
        sessionStorage.removeItem("refreshToken");
        sessionStorage.removeItem("username");
        sessionStorage.removeItem("email");
        setIsAuthenticated(false);
    };

    return (
        <GoogleOAuthProvider clientId="696329622413-bmtqjetfvcgq0pqi1q6basundd0u36pk.apps.googleusercontent.com">
            <Router>
                <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
                <Routes>
                    <Route path="/home" element={<Home />} />
                    <Route
                        path="/add"
                        element={
                            <PrivateRoute>
                                <Add />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/account"
                        element={
                            <PrivateRoute>
                                <Account />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/favorites"
                        element={
                            <PrivateRoute>
                                <Favorites />
                            </PrivateRoute>
                        }
                    />
                    <Route path="/ads/:subject" element={<SubjectAds />} />
                    <Route path="/search/:query" element={<SubjectAds />} />
                    <Route path="/ads/id/:id/edit" element={<EditAd />} />
                    <Route path="/" element={<Home />} />
                    <Route
                        path="/login"
                        element={<LoginRegister setIsAuthenticated={setIsAuthenticated} />}
                    />
                    <Route
                        path="/register"
                        element={<LoginRegister setIsAuthenticated={setIsAuthenticated} />}
                    />
                    <Route path="/docs" element={<SwaggerDocumentation />} />
                </Routes>
            </Router>
        </GoogleOAuthProvider>
    );
}

export default App;
