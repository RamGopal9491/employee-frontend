import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Addemployee.css";

const SIGNUP_URL = "http://localhost:8083/users/signup";
const DEPT_API = "http://localhost:8083/api/departments";
const API_URL=import.meta.env.VITE_API_URL

export default function AddEmployee() {
  const navigate = useNavigate();

  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({
    id: "",               // will become empid
    name: "",             // will become fullname
    email: "",
    dob: "",
    gender: "Male",
    maritalStatus: "Single",
    designation: "",
    department: "",
    salary: "",
    password: "",
  });

  // Fetch departments for dropdown
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/departments`);
        setDepartments(res.data || []);
      } catch (err) {
        console.error("Error fetching departments:", err);
        setDepartments([]);
      }
    };
    fetchDepartments();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((s) => ({ ...s, [name]: value }));
  };

  // Submit to user signup endpoint instead of addemployees
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Build body matching your Users model (adjust keys if your model differs)
    const payload = {
      empid: formData.id,
      fullname: formData.name,
      email: formData.email,
      password: formData.password,
      department: formData.department,
      dob: formData.dob,
      gender: formData.gender,
      marital: formData.maritalStatus,
      designation: formData.designation,
      salary: formData.salary,
      // you can add role/defaults here if needed, e.g. role: "EMPLOYEE"
    };

    try {
      const res = await axios.post(`${API_URL}/users/signup`, payload);
      // controller returns a ResponseEntity -> check message or status
      alert("✅ User added successfully!");
      navigate("/employees");
    } catch (error) {
      console.error("Error adding user:", error);
      const msg =
        error?.response?.data ||
        error?.response?.data?.message ||
        "Failed to add user";
      alert(`❌ ${msg}`);
    }
  };

  return (
    <div className="add-employee-container">
      <form className="add-employee-form" onSubmit={handleSubmit}>
        <h2>Add New Employee (create User)</h2>

        <div className="form-grid">
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
              required
            >
              <option value="">Select Department</option>
              {departments.length > 0 ? (
                departments.map((dept) => (
                  <option key={dept.id} value={dept.name}>
                    {dept.name}
                  </option>
                ))
              ) : (
                <option disabled>No departments available</option>
              )}
            </select>
          </div>

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
              required
            />
          </div>
        </div>

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
