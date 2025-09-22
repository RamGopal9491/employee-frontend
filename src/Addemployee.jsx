import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddEmployee.css";

export default function AddEmployee() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    email: "",
    dob: "",
    gender: "Male",
    maritalStatus: "Single",
    designation: "",
    department: "",
    salary: "",
    password: "",
  });

  // handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (
      !formData.id ||
      !formData.name ||
      !formData.email ||
      !formData.designation ||
      !formData.department
    ) {
      alert("Please fill all required fields!");
      return;
    }

    // Get existing employees from localStorage
    const existing = JSON.parse(localStorage.getItem("employees")) || [];

    // Add new employee
    const updatedEmployees = [...existing, formData];

    // Save back to localStorage
    localStorage.setItem("employees", JSON.stringify(updatedEmployees));

    alert("Employee added successfully!");

    // Redirect to employees list
    navigate("/employees");
  };

  return (
    <div className="add-employee-container">
      <form className="add-employee-form" onSubmit={handleSubmit}>
        <h2>Add New Employee</h2>

        <div className="form-grid">
          {/* Row 1 */}
          <div>
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Row 2 */}
          <div>
            <label>Employee ID</label>
            <input
              type="text"
              name="id"
              value={formData.id}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
            />
          </div>

          {/* Row 3 */}
          <div>
            <label>Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label>Marital Status</label>
            <select
              name="maritalStatus"
              value={formData.maritalStatus}
              onChange={handleChange}
            >
              <option>Single</option>
              <option>Married</option>
              <option>Divorced</option>
            </select>
          </div>

          {/* Row 4 */}
          <div>
            <label>Designation</label>
            <input
              type="text"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Department</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
            >
              <option value="">Select Department</option>
              <option>IT</option>
              <option>HR</option>
              <option>Finance</option>
              <option>Marketing</option>
            </select>
          </div>

          {/* Row 5 */}
          <div>
            <label>Salary</label>
            <input
              type="number"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="form-buttons">
          <button type="submit" className="btn-save">
            Save
          </button>
          <button
            type="button"
            className="btn-cancel"
            onClick={() => navigate("/employees")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
