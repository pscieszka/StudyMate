import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <Link to="/home" className="navbar-logo">StudyMate</Link>
      <div className="navbar-links">
        <Link to="/add" className="navbar-add-button">Add</Link>
        <Link to="/home" className="navbar-link">Home</Link>
        <span className="navbar-icon" aria-label="Favorites">❤️</span>
        <Link to="/account" className="navbar-link">My Account</Link>
        <button className="navbar-logout-button">Log Out</button>
      </div>
    </nav>
  );
};

export default Navbar;