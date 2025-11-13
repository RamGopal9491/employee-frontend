import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Dashboard.css";

export default function Dashboard() {
  const API_BASE = "http://localhost:8083/users";
  const DEPT_API = "http://localhost:8083/api/departments";
  const LEAVE_API = "http://localhost:8083/api/leaves";

  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [leaves, setLeaves] = useState([]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/signin");
  };

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(`${API_BASE}/getAllUsers`);
      setEmployees(res.data || []);
    } catch (err) {
      console.error("Error fetching employees:", err);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await axios.get(`${DEPT_API}`);
      setDepartments(res.data || []);
    } catch (err) {
      console.error("Error fetching departments:", err);
    }
  };

  const fetchLeaves = async () => {
    try {
      const today = new Date().toISOString().split("T")[0];
      const res = await axios.get(`${LEAVE_API}`);
      const allLeaves = res.data || [];

      const todayLeaves = allLeaves.filter(
        (leave) => leave.appliedDate === today
      );

      setLeaves(todayLeaves);
    } catch (err) {
      console.error("Error fetching leaves:", err);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
    fetchLeaves();
  }, []);

  return (
    <div>
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
        <div className="dashboard-container">
          <h2 className="dashboard-title">Admin Dashboard</h2>
          <p className="dashboard-subtitle">
            Welcome back, Admin. Here’s an overview of your organization.
          </p>

          <div className="dashboard-stats">
            <div className="stat-card">
              <h3>{employees.length}</h3>
              <p>Total Employees</p>
            </div>

            <div className="stat-card">
              <h3>{departments.length}</h3>
              <p>Departments</p>
            </div>

            <div className="stat-card">
              <h3>$500k</h3>
              <p>Monthly Payroll</p>
            </div>

            <div className="stat-card">
              <h3>{leaves.length}</h3>
              <p>Leave Requests Today</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
