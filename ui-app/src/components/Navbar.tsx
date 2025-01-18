import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

interface NavbarProps {
  isAuthenticated: boolean;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isAuthenticated, onLogout }) => {
  return (
    <nav className="navbar">
      <Link to="/home" className="navbar-logo">StudyMate</Link>
      <div className="navbar-links">
        <Link to="/add" className="navbar-add-button">Add</Link>
        <Link to="/home" className="navbar-link">Home</Link>
        <span className="navbar-icon" aria-label="Favorites">❤️</span>
        <Link to="/account" className="navbar-link">My Account</Link>
        {isAuthenticated ? (
          <button onClick={onLogout} className="navbar-logout-button">
            Log Out
          </button>
        ) : (
          <>
            <Link to="/login" className="navbar-link">Log In</Link>
            <Link to="/register" className="navbar-link">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
