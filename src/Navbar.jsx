// src/Navbar.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  // read user once (safe parse)
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch (e) {
    console.warn("Invalid user in localStorage:", e);
    user = null;
  }

  useEffect(() => {
    // if no user, redirect to signin
    if (!user) {
      navigate("/signin");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally empty: we only want this check on mount

  const handleLogout = () => {
    // clear stored user and navigate to signin
    localStorage.removeItem("user");
    navigate("/signin");
  };

  return (
    <header className="navbar">
      <h1 className="navbar-logo">Employee MS</h1>
      <div className="navbar-right">
        {/* guard against null user */}
        <span className="navbar-center">Welcome, {user?.fullname ?? "Guest"}</span>
        <button className="btn-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}

export default Navbar;
