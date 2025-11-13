import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import EmployeeManagement from "./EmployeeManagement";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import Payslips from "./Payslips";
import Leave from "./Leave";
import Profile from "./Profile";
import EmployeeDashboard from "./EmployeeDashboard";
import Employees from "./Employees";
import Payroll from "./Payroll";
import Performance from "./Performance";
import Dashboard from "./Dashboard";
import AddEmployee from "./Addemployee";
import Department from "./Department";
import Salary from "./Salary";
import Leaves from "./Leaves";
import Sidebar from "./Sidebar";
import "./App.css";
import { Toaster } from "react-hot-toast"; // ✅ correct usage
import Navbar from "./Navbar";

function AppContent() {
  const [employees, setEmployees] = useState([]);
  const location = useLocation();

  // hide sidebar on sign-in & sign-up pages
  const hideSidebar = ["/signin", "/signup"].includes(location.pathname);

  const handleAddEmployee = (newEmployee) => {
    setEmployees((prev) => [...prev, newEmployee]);
  };
  const user = JSON.parse(localStorage.getItem("user"))
  return (
    <div className="app-container">
      {/* ✅ Only one Toaster instance for the entire app */}
      {/* <Toaster position="top-right" reverseOrder={false} /> */}

      {!hideSidebar && <Sidebar />}
      <div className="main-content">
         {!hideSidebar && (
          <Navbar/>
        )}
        <Routes>
          {/* Auth Routes */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Landing Page */}
          <Route path="/" element={ user?.role=="admin" ?<Dashboard />:<EmployeeDashboard/> } />

          {/* Employee Pages */}
          <Route path="/payslips" element={<Payslips />} />
          <Route path="/leave" element={<Leave />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/employee-dashboard" element={<EmployeeDashboard />} />

          {/* Employee Management */}
          <Route path="/employees" element={<Employees employees={employees} />} />
          <Route path="/addemployee" element={<AddEmployee onAdd={handleAddEmployee} />} />

          {/* Admin Pages */}
          <Route path="/department" element={<Department />} />
          <Route path="/payroll" element={<Payroll />} />
          <Route path="/performance" element={<Performance />} />
          <Route path="/salary" element={<Salary />} />
          <Route path="/leaves" element={<Leaves />} />
          <Route path="/admin-dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
      <Router>
        <AppContent />
      </Router>
    
  );
}

export default App;
