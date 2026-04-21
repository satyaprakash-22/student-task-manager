import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar({ setIsLoggedIn, darkMode, toggleDark }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <div className="navbar">
      <div className="logo">TaskMate</div>
      <nav>
        {user ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
            <span style={{ color: "#aaa", fontSize: "14px" }}>Hi, {user.name}</span>
            <button className="theme-toggle" onClick={toggleDark}>
              {darkMode ? "☀️" : "🌙"}
            </button>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
            <button className="theme-toggle" onClick={toggleDark}>
              {darkMode ? "☀️" : "🌙"}
            </button>
            <Link to="/login">Login</Link>
            <Link to="/register">
              <button>Register</button>
            </Link>
          </>
        )}
      </nav>
    </div>
  );
}

export default Navbar;