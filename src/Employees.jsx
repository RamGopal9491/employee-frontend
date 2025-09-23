import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./Employees.css";

const BASEURL = "http://localhost:8083/api/employees";

export default function Employees() {
  const navigate = useNavigate();
  const location = useLocation();
  const [employees, setEmployees] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [viewingId, setViewingId] = useState(null);
  const [editData, setEditData] = useState({
    name: "",
    dob: "",
    department: "",
    gender: "",
    maritalStatus: "",
    image: "",
  });

  // Fetch employees
  const fetchEmployees = () => {
    axios
      .get(BASEURL)
      .then((res) => setEmployees(res.data))
      .catch((err) => console.error("Error fetching employees:", err));
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Handle adding a new employee from AddEmployee.jsx
  const handleAddEmployee = (newEmployee) => {
    setEmployees((prev) => [...prev, newEmployee]);
  };

  // Delete employee
  const handleDelete = (id) => {
    axios.delete(`${BASEURL}/${id}`).then(() => {
      setEmployees((prev) => prev.filter((emp) => emp.id !== id));
    });
  };

  // Edit employee
  const handleEdit = (emp) => {
    setEditingId(emp.id);
    setEditData(emp);
  };

  const handleSave = () => {
    axios.put(`${BASEURL}/${editingId}`, editData).then((res) => {
      setEmployees((prev) =>
        prev.map((emp) => (emp.id === editingId ? res.data : emp))
      );
      setEditingId(null);
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditData({
      name: "",
      dob: "",
      department: "",
      gender: "",
      maritalStatus: "",
      image: "",
    });
  };

  const handleView = (emp) => setViewingId(emp.id);
  const handleCloseView = () => setViewingId(null);

  const filteredEmployees = searchId
    ? employees.filter((emp) =>
        emp.id.toString().includes(searchId.toLowerCase())
      )
    : employees;

  return (
    <div className="employees-container">
      <h2 className="employees-title">Employee List</h2>

      <div className="employees-controls">
        <input
          type="text"
          placeholder="Search by Employee ID"
          className="search-input"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />
        <button
          className="btn-add-new"
          onClick={() =>
            navigate("/addemployee", { state: { onAddEmployee: handleAddEmployee } })
          }
        >
          Add New Employee
        </button>
      </div>

      <table className="employees-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>DOB</th>
            <th>Department</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.length > 0 ? (
            filteredEmployees.map((emp) => (
              <tr key={emp.id}>
                <td>{emp.id}</td>
                <td>{emp.name}</td>
                <td>{emp.dob}</td>
                <td>{emp.department}</td>
                <td>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button className="btn-view" onClick={() => handleView(emp)}>
                      View
                    </button>
                    <button className="btn-edit" onClick={() => handleEdit(emp)}>
                      Edit
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(emp.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" style={{ textAlign: "center" }}>
                No employee found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* View and Edit modals remain unchanged */}
    </div>
  );
}
