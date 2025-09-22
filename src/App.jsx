import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EmployeeManagement from "./EmployeeManagement";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import Payslips from "./Payslips";
import Leave from "./Leave";
import Profile from "./Profile";
import EmployeeDashboard from "./EmployeeDashboard";
import Employees from "./Employees";
import Attendance from "./Attendance";
import Payroll from "./Payroll";
import Performance from "./Performance";
import Dashboard from "./Dashboard";
import AssignRoles from "./Assignroles";
import { AttendanceProvider } from "./AttendanceContext";
import AddEmployee from "./Addemployee";
import Department from "./Department";
import Salary from "./Salary";
import Leaves from "./Leaves";

function App() {
  const [employees, setEmployees] = useState([]);

  // add new employee
  const handleAddEmployee = (newEmployee) => {
    setEmployees((prev) => [...prev, newEmployee]);
  };

  return (
    <AttendanceProvider>
      <Router>
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<EmployeeManagement />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/payslips" element={<Payslips />} />
          <Route path="/leave" element={<Leave />} />
          <Route path="/profile" element={<Profile />} />

          {/* Dashboard Page */}
          <Route path="/employee-dashboard" element={<EmployeeDashboard />} />

          {/* Employees */}
          <Route
            path="/employees"
            element={<Employees employees={employees} />}
          />
          <Route
            path="/addemployee"
            element={<AddEmployee onAdd={handleAddEmployee} />}
          />

          {/* Other Pages */}
          <Route path="/department" element={<Department />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/payroll" element={<Payroll />} />
          <Route path="/performance" element={<Performance />} />
          <Route path="/salary" element={<Salary />} />
          <Route path="/leaves" element={<Leaves />} />

          {/* Admin Side */}
          <Route path="/admin-dashboard" element={<Dashboard />} />
          <Route path="/assignroles" element={<AssignRoles />} />
        </Routes>
      </Router>
    </AttendanceProvider>
  );
}

export default App;
