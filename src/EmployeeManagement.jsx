import React from "react";
import { useNavigate } from "react-router-dom";
import "./EmployeeManagement.css";

export default function EmployeeManagement() {
  const navigate = useNavigate();

  return (
    <div className="ems-container">
      {/* Navbar */}
      {/* <header className="ems-header">
        <div className="ems-logo-section">
          <span className="ems-logo">EMS</span>
          <h1 className="ems-title">Employee Management System</h1>
        </div>
        <div>
          <button className="ems-signin" onClick={() => navigate("/signin")}>
            <span className="ems-icon">👤</span> Sign In
          </button>
        </div>
      </header> */}

      {/* Hero Section */}
      <main className="ems-hero">
        <h2 className="ems-subtitle">ORGANIZATION'S #1 EMPLOYEE PLATFORM</h2>
        <h1 className="ems-heading">Manage your workforce easily</h1>
        <p className="ems-description">
          Discover employee details, track attendance, and streamline HR processes
        </p>

        {/* Search Bar */}
        <div className="ems-searchbar">
          <input
            type="text"
            placeholder='Search by "Employee Name"'
            className="ems-input"
          />
          <input
            type="text"
            placeholder="Department / Role"
            className="ems-input"
          />
          <button className="ems-search-btn">Search</button>
        </div>
      </main>

      {/* Footer */}
      <footer className="ems-footer">
        © {new Date().getFullYear()} Employee Management System. All rights reserved.
      </footer>
    </div>
  );
}
