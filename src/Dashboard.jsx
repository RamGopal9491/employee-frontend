import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { AttendanceContext } from "./AttendanceContext";

// Import sidebar icons (FontAwesome)
import {
  FaUsers,
  FaBuilding,
  FaCalendarAlt,
  FaClipboardCheck,
  FaMoneyBillWave,
  FaChartLine,
  FaUserShield,
} from "react-icons/fa";

export default function Dashboard() {
  const { attendance } = useContext(AttendanceContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear authentication/session if needed
    // localStorage.removeItem("token");
    navigate("/signin");
  };

  return (
    <div>
      {/* Navbar */}
      <div className="navbar">
        <div className="navbar-left">Employee MS</div>
        <div className="navbar-center">Welcome, Admin</div>
        <div className="navbar-right">
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="dashboard-layout">
        {/* Sidebar */}
        <div className="sidebar">
          <h2 className="sidebar-title">Admin Panel</h2>
          <nav className="sidebar-links">
            <NavLink to="/employees" className="sidebar-link">
              <FaUsers className="sidebar-icon" /> Manage Employees
            </NavLink>

            <NavLink to="/department" className="sidebar-link">
              <FaBuilding className="sidebar-icon" /> Department
            </NavLink>

            <NavLink to="/leaves" className="sidebar-link">
              <FaCalendarAlt className="sidebar-icon" /> Leaves
            </NavLink>

            <NavLink to="/attendance" className="sidebar-link">
              <FaClipboardCheck className="sidebar-icon" /> Attendance Records
            </NavLink>

            <NavLink to="/payroll" className="sidebar-link">
              <FaMoneyBillWave className="sidebar-icon" /> Payroll
            </NavLink>

            <NavLink to="/performance" className="sidebar-link">
              <FaChartLine className="sidebar-icon" /> Performance
            </NavLink>

            <NavLink to="/assignroles" className="sidebar-link">
              <FaUserShield className="sidebar-icon" /> Assign Roles
            </NavLink>
          </nav>
        </div>

        {/* Main Content */}
        <div className="dashboard-container">
          <h2 className="dashboard-title">Admin Dashboard</h2>
          <p className="dashboard-subtitle">
            Welcome back, Admin. Here’s an overview of your organization.
          </p>

          {/* Stats Section */}
          <div className="dashboard-stats">
            <div className="stat-card">
              <h3>120</h3>
              <p>Total Employees</p>
            </div>
            <div className="stat-card">
              <h3>8</h3>
              <p>Departments</p>
            </div>
            <div className="stat-card">
              <h3>$500k</h3>
              <p>Monthly Payroll</p>
            </div>
            <div className="stat-card">
              <h3>15</h3>
              <p>Leave Requests</p>
            </div>
          </div>

          {/* Attendance Table */}
          <div className="attendance-section">
            <h3 className="attendance-title">Today’s Attendance</h3>
            <table className="attendance-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Status</th>
                  <th>Marked At</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(attendance).length > 0 ? (
                  Object.values(attendance).map((record, index) => (
                    <tr key={index}>
                      <td>{record.name}</td>
                      <td>
                        {record.status === "Present" ? (
                          <span className="status-present">Present</span>
                        ) : (
                          <span className="status-absent">Absent</span>
                        )}
                      </td>
                      <td>{record.dateTime ? record.dateTime : ""}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3">No attendance marked yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
