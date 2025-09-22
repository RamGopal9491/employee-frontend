import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Employees.css";

const BASEURL = "http://localhost:8080/api/employees";

export default function Employees() {
  const navigate = useNavigate();
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

  // ✅ Load employees from backend
  useEffect(() => {
    axios
      .get(BASEURL)
      .then((res) => setEmployees(res.data))
      .catch((err) => console.error("Error fetching employees:", err));
  }, []);

  // ✅ Delete employee
  const handleDelete = (id) => {
    axios.delete(`${BASEURL}/${id}`).then(() => {
      setEmployees((prev) => prev.filter((emp) => emp.id !== id));
    });
  };

  // ✅ Edit employee
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

  // ✅ Search filter
  const filteredEmployees = searchId
    ? employees.filter((emp) =>
        emp.id.toString().includes(searchId.toLowerCase())
      )
    : employees;

  return (
    <div className="employees-container">
      <h2 className="employees-title">Employee List</h2>

      {/* Controls */}
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
          onClick={() => navigate("/addemployee")}
        >
          Add New Employee
        </button>
      </div>

      {/* Table */}
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

      {/* View Modal */}
      {viewingId && (
        <div className="modal-overlay">
          <div className="modal-content view-modal">
            {employees
              .filter((emp) => emp.id === viewingId)
              .map((emp) => (
                <div key={emp.id} className="employee-details-card">
                  <img
                    src={emp.image || "https://via.placeholder.com/100"}
                    alt={emp.name}
                    className="employee-img"
                  />
                  <div className="employee-info">
                    <h3>Employee Details</h3>
                    <p>
                      <strong>Name:</strong> {emp.name}
                    </p>
                    <p>
                      <strong>Employee ID:</strong> emp{emp.id}
                    </p>
                    <p>
                      <strong>Date of Birth:</strong> {emp.dob}
                    </p>
                    <p>
                      <strong>Gender:</strong> {emp.gender}
                    </p>
                    <p>
                      <strong>Department:</strong> {emp.department}
                    </p>
                    <p>
                      <strong>Marital Status:</strong> {emp.maritalStatus}
                    </p>
                  </div>
                </div>
              ))}
            <button className="btn-cancel" onClick={handleCloseView}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingId && (
        <div className="modal-overlay">
          <div className="modal-content edit-modal">
            <h2>Edit Employee</h2>
            <div className="form-grid">
              <div>
                <label>Name</label>
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) =>
                    setEditData({ ...editData, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label>Date of Birth</label>
                <input
                  type="date"
                  value={editData.dob}
                  onChange={(e) =>
                    setEditData({ ...editData, dob: e.target.value })
                  }
                />
              </div>
              <div>
                <label>Department</label>
                <input
                  type="text"
                  value={editData.department}
                  onChange={(e) =>
                    setEditData({ ...editData, department: e.target.value })
                  }
                />
              </div>
              <div>
                <label>Gender</label>
                <input
                  type="text"
                  value={editData.gender}
                  onChange={(e) =>
                    setEditData({ ...editData, gender: e.target.value })
                  }
                />
              </div>
              <div>
                <label>Marital Status</label>
                <input
                  type="text"
                  value={editData.maritalStatus}
                  onChange={(e) =>
                    setEditData({ ...editData, maritalStatus: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="form-buttons">
              <button className="btn-save" onClick={handleSave}>
                Update Employee
              </button>
              <button className="btn-cancel" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
