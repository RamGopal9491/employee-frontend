import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./EmployeeDashboard.css";
import {
  FaTachometerAlt,
  FaUserEdit,
  FaCalendarAlt,
  FaFileInvoiceDollar,
  FaMoneyBillWave,
} from "react-icons/fa";

export default function EmployeeDashboard() {

  const navigate = useNavigate();
  const location = useLocation();
useEffect(() => {
    // if no user, redirect to signin
    if (!user) {
      navigate("/signin");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const user = JSON.parse(localStorage.getItem("user"));
  const employeeName = location.state?.name || "Employee";

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/signin");
  };

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">
        {/* Main Content */}
        <main className="dashboard-main">
          {/* ✅ Employee Profile Card */}
          <section className="profile-card">
            <img
              src={user?.photo || "https://via.placeholder.com/80"}
              alt="Employee"
              className="profile-avatar"
            />
            <div>
              <h3 className="profile-name">{user?.fullname}</h3>
              <p className="profile-role">Software Engineer</p>
              <p className="profile-dept">Department: {user?.department}</p>
            </div>
          </section>

          {/* Dashboard Overview */}
          <section className="dashboard-overview">
            <h2>Welcome, {user?.fullname || employeeName}!</h2>
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
