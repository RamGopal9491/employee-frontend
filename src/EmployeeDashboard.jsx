import React from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAttendance } from "./AttendanceContext";
import "./EmployeeDashboard.css";

import {
  FaTachometerAlt,
  FaUserEdit,
  FaCalendarAlt,
  FaFileInvoiceDollar,
  FaMoneyBillWave,
} from "react-icons/fa";

export default function EmployeeDashboard() {
  const { markAttendance } = useAttendance();
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Get employee name/email from router state
  const employeeName = location.state?.name || "Employee";

  const handlePresent = () => {
    markAttendance(1, employeeName, "Present");
  };

  const handleAbsent = () => {
    markAttendance(1, employeeName, "Absent");
  };

  // ✅ Logout handler
  const handleLogout = () => {
    navigate("/signin");
  };

  return (
    <div className="dashboard-wrapper">
      {/* ✅ Top Navbar */}
      <header className="navbar">
        <h1 className="navbar-logo">Employee MS</h1>
        <div className="navbar-right">
          <span className="navbar-center">Welcome, {employeeName}</span>
          <button className="btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <div className="dashboard-container">
        {/* Sidebar */}
        <aside className="dashboard-sidebar">
          <nav className="sidebar-nav">
            <NavLink to="/" className="sidebar-link">
              <FaTachometerAlt className="sidebar-icon" /> Dashboard
            </NavLink>
            <NavLink to="/profile" className="sidebar-link">
              <FaUserEdit className="sidebar-icon" /> Update Info
            </NavLink>
            <NavLink to="/leave" className="sidebar-link">
              <FaCalendarAlt className="sidebar-icon" /> Apply Leave
            </NavLink>
            <NavLink to="/payslips" className="sidebar-link">
              <FaFileInvoiceDollar className="sidebar-icon" /> Payslips
            </NavLink>
            <NavLink to="/salary" className="sidebar-link">
              <FaMoneyBillWave className="sidebar-icon" /> Salary
            </NavLink>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="dashboard-main">
          {/* Employee Profile */}
          <section className="profile-card">
            <img
              src="https://via.placeholder.com/80"
              alt="Employee"
              className="profile-avatar"
            />
            <div>
              <h3 className="profile-name">{employeeName}</h3>
              <p className="profile-role">Software Engineer</p>
              <p className="profile-dept">Department: IT</p>
            </div>
          </section>

          {/* Attendance Buttons */}
          <section className="attendance-actions">
            <h3>Mark Your Attendance</h3>
            <button onClick={handlePresent} className="btn-present">
              Present
            </button>
            <button onClick={handleAbsent} className="btn-absent">
              Absent
            </button>
          </section>

          {/* Dashboard Quick Links */}
          <section className="dashboard-overview">
            <h2>Welcome to Your Dashboard</h2>
            <p>Here you can:</p>
            <ul>
              <li>💰 View and download your payslips</li>
              <li>📝 Apply for leave requests</li>
              <li>👤 Update your personal information</li>
            </ul>
          </section>
        </main>
      </div>
    </div>
  );
}
