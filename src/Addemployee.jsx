import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AddEmployee.css";

const BASEURL = "http://localhost:8083/api/addemployees";

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(BASEURL, formData);

      alert("Employee added successfully!");

      // Navigate back to employees list
      navigate("/employees");
    } catch (error) {
      console.error("Error adding employee:", error);
      alert("Failed to add employee!");
    }
  };

  return (
    <div className="add-employee-container">
      <form className="add-employee-form" onSubmit={handleSubmit}>
        <h2>Add New Employee</h2>
        <div className="form-grid">
          <div>
            <label>Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div>
            <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div>
            <label>Employee ID</label>
            <input type="text" name="id" value={formData.id} onChange={handleChange} required />
          </div>
          <div>
            <label>Date of Birth</label>
            <input type="date" name="dob" value={formData.dob} onChange={handleChange} />
          </div>
          <div>
            <label>Gender</label>
            <select name="gender" value={formData.gender} onChange={handleChange}>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label>Marital Status</label>
            <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange}>
              <option>Single</option>
              <option>Married</option>
              <option>Divorced</option>
            </select>
          </div>
          <div>
            <label>Designation</label>
            <input type="text" name="designation" value={formData.designation} onChange={handleChange} />
          </div>
          <div>
            <label>Department</label>
            <select name="department" value={formData.department} onChange={handleChange}>
              <option value="">Select Department</option>
              <option>IT</option>
              <option>HR</option>
              <option>Finance</option>
              <option>Marketing</option>
            </select>
          </div>
          <div>
            <label>Salary</label>
            <input type="number" name="salary" value={formData.salary} onChange={handleChange} />
          </div>
          <div>
            <label>Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} />
          </div>
        </div>

        <div className="form-buttons">
          <button type="submit" className="btn-save">Save</button>
          <button type="button" className="btn-cancel" onClick={() => navigate("/employees")}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
