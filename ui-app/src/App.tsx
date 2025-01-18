import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Add from "./pages/Add";
import Account from "./pages/Account";
import "./App.css";
import Home from "./pages/Home";
import SubjectAds from "./pages/SubjectAds";
import LoginRegister from "./pages/LoginRegister";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    !!sessionStorage.getItem("accessToken")
  );

  const handleLogout = () => {
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    setIsAuthenticated(false);
  };

  return (
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
        <Route path="/ads/:subject" element={<SubjectAds />} />
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={<LoginRegister setIsAuthenticated={setIsAuthenticated} />}
        />
        <Route
          path="/register"
          element={<LoginRegister setIsAuthenticated={setIsAuthenticated} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
