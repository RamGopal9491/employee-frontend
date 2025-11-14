import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Department.css";

const BASEURL = "http://localhost:8083/api/departments";
const API_URL=import.meta.env.VITE_API_URL

export default function Department() {
  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState("");
  const [editingDept, setEditingDept] = useState(null);
  const [newDept, setNewDept] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ✅ Fetch departments
  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = () => {
    axios
      .get(`${API_URL}/api/departments`)
      .then((res) => setDepartments(res.data))
      .catch((err) => console.error("Error fetching departments:", err));
  };

  // ✅ Add or Update Department
  const handleAddDepartment = () => {
    if (!newDept.trim()) return;

    if (editingDept) {
      // Update department
      axios
        .put(`${BASEURL}/${editingDept.id}`, { name: newDept })
        .then((res) => {
          setDepartments((prev) =>
            prev.map((d) => (d.id === editingDept.id ? res.data : d))
          );
          resetModal();
        })
        .catch((err) => console.error("Error updating department:", err));
    } else {
      // Create new department
      axios
        .post(BASEURL, { name: newDept })
        .then((res) => {
          setDepartments((prev) => [...prev, res.data]);
          resetModal();
        })
        .catch((err) => console.error("Error creating department:", err));
    }
  };

  // ✅ Delete Department
  const handleDelete = (id) => {
    axios
      .delete(`${BASEURL}/${id}`)
      .then(() => setDepartments((prev) => prev.filter((d) => d.id !== id)))
      .catch((err) => console.error("Error deleting department:", err));
  };

  // ✅ Edit Department
  const handleEdit = (dept) => {
    setEditingDept(dept);
    setNewDept(dept.name);
    setIsModalOpen(true);
  };

  // ✅ Reset modal state
  const resetModal = () => {
    setEditingDept(null);
    setNewDept("");
    setIsModalOpen(false);
  };

  // ✅ Filtered list
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
                  <button className="btn-edit" onClick={() => handleEdit(dept)}>
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

      {/* ✅ Modal for Add/Edit */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" onMouseDown={(e) => e.stopPropagation()}>
            <h3>{editingDept ? "Edit Department" : "Add New Department"}</h3>

            {/* ✅ Input field bound to state */}
            <input
              type="text"
              placeholder="Enter Department Name"
              value={newDept}
              onChange={(e) => setNewDept(e.target.value)}
              className="modal-input"
              autoFocus
            />

            <div className="modal-buttons">
              <button className="btn-save" onClick={handleAddDepartment}>
                {editingDept ? "Update" : "Save"}
              </button>
              <button className="btn-cancel" onClick={resetModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
