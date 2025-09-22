import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Department.css";

const BASEURL = "http://localhost:8080/api/departments";

export default function Department() {
  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState("");
  const [editingDept, setEditingDept] = useState(null);
  const [newDept, setNewDept] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Predefined department options for dropdown
  const predefinedDepartments = [
    "IT",
    "Database",
    "Logistic",
    "HR",
    "Finance",
    "Marketing",
  ];

  // ✅ Fetch departments from backend
  useEffect(() => {
    axios
      .get(BASEURL)
      .then((res) => setDepartments(res.data))
      .catch((err) => console.error("Error fetching departments:", err));
  }, []);

  // ✅ Add or Update Department
  const handleAddDepartment = () => {
    if (!newDept.trim()) return;

    if (editingDept) {
      // Update
      axios
        .put(`${BASEURL}/${editingDept.id}`, { name: newDept })
        .then((res) => {
          setDepartments(
            departments.map((d) => (d.id === editingDept.id ? res.data : d))
          );
          setEditingDept(null);
          setNewDept("");
          setIsModalOpen(false);
        })
        .catch((err) => console.error("Error updating department:", err));
    } else {
      // Create
      axios
        .post(BASEURL, { name: newDept })
        .then((res) => {
          setDepartments([...departments, res.data]);
          setNewDept("");
          setIsModalOpen(false);
        })
        .catch((err) => console.error("Error creating department:", err));
    }
  };

  // ✅ Delete Department
  const handleDelete = (id) => {
    axios
      .delete(`${BASEURL}/${id}`)
      .then(() => {
        setDepartments(departments.filter((d) => d.id !== id));
      })
      .catch((err) => console.error("Error deleting department:", err));
  };

  // ✅ Edit Department
  const handleEdit = (dept) => {
    setEditingDept(dept);
    setNewDept(dept.name);
    setIsModalOpen(true);
  };

  // ✅ Search filter
  const filteredDepartments = search
    ? departments.filter((d) =>
        d.name.toLowerCase().includes(search.toLowerCase())
      )
    : departments;

  return (
    <div className="department-container">
      <h2 className="department-title">Manage Departments</h2>

      {/* Controls */}
      <div className="department-controls">
        <input
          type="text"
          placeholder="Search By Department"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        <button
          className="btn-add"
          onClick={() => {
            setEditingDept(null);
            setNewDept("");
            setIsModalOpen(true);
          }}
        >
          Add New Department
        </button>
      </div>

      {/* Table */}
      <table className="department-table">
        <thead>
          <tr>
            <th>S No</th>
            <th>Department</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredDepartments.length > 0 ? (
            filteredDepartments.map((dept, index) => (
              <tr key={dept.id}>
                <td>{index + 1}</td>
                <td>{dept.name}</td>
                <td>
                  <button
                    className="btn-edit"
                    onClick={() => handleEdit(dept)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(dept.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" style={{ textAlign: "center" }}>
                No department found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal for Add/Edit */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{editingDept ? "Edit Department" : "Add New Department"}</h3>

            {/* Dropdown instead of input */}
            <select
              value={newDept}
              onChange={(e) => setNewDept(e.target.value)}
              className="modal-input"
            >
              <option value="">-- Select Department --</option>
              {predefinedDepartments.map((dept, index) => (
                <option key={index} value={dept}>
                  {dept}
                </option>
              ))}
            </select>

            <div className="modal-buttons">
              <button className="btn-save" onClick={handleAddDepartment}>
                {editingDept ? "Update" : "Save"}
              </button>
              <button
                className="btn-cancel"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
