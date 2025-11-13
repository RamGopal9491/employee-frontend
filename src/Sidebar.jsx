import React, { useEffect } from 'react';
import {
  FaBuilding,
  FaCalendarAlt,
  FaChartLine,
  FaClipboardCheck,
  FaMoneyBillWave,
  FaUsers,
  FaUserShield,
  FaUser,
  FaFileInvoiceDollar,
  FaPeopleArrows,
} from 'react-icons/fa';
import { NavLink, useNavigate } from 'react-router-dom';

function Sidebar() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate()
  
    useEffect(() => {
        // if no user, redirect to signin
        if (!user) {
          navigate("/signin");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);
  if (!user) {
    return (
      <div className="sidebar">
        <h2 className="sidebar-title">Unauthorized</h2>
        <p>Please log in to view content.</p>
      </div>
    );
  }

  const isAdmin = user.role === "admin";
  return (
    <div className="sidebar">
      <h2 className="sidebar-title">
        {isAdmin ? "Admin Panel" : "Employee Dashboard"}
      </h2>

      <nav className="sidebar-links">
        {isAdmin ? (
          <>
          <NavLink to="/admin-dashboard" className="sidebar-link">
             <FaPeopleArrows className='sidebar-icon' /> Admin Dashboard
          </NavLink>
            <NavLink to="/employees" className="sidebar-link">
              <FaUsers className="sidebar-icon" /> Manage Employees
            </NavLink>

            <NavLink to="/department" className="sidebar-link">
              <FaBuilding className="sidebar-icon" /> Department
            </NavLink>

            <NavLink to="/leaves" className="sidebar-link">
              <FaCalendarAlt className="sidebar-icon" /> Leaves
            </NavLink>

            <NavLink to="/payroll" className="sidebar-link">
              <FaMoneyBillWave className="sidebar-icon" /> Payroll
            </NavLink>

            <NavLink to="/performance" className="sidebar-link">
              <FaChartLine className="sidebar-icon" /> Performance
            </NavLink>
          </>
        ) : (
          <>
          <NavLink to="/employee-dashboard" className="sidebar-link">
              <FaUser className="sidebar-icon" /> Employee-Dashboard
            </NavLink>
            <NavLink to="/profile" className="sidebar-link">
              <FaUser className="sidebar-icon" /> My Profile
            </NavLink>

            <NavLink to="/leave" className="sidebar-link">
              <FaCalendarAlt className="sidebar-icon" /> Apply Leave
            </NavLink>

            <NavLink to="/payslips" className="sidebar-link">
              <FaFileInvoiceDollar className="sidebar-icon" /> Payslips
            </NavLink>

            <NavLink to="/salary" className="sidebar-link">
              <FaMoneyBillWave className="sidebar-icon" /> Salary Details
            </NavLink>
          </>
        )}
      </nav>
    </div>
  );
}

export default Sidebar;
