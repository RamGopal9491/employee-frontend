import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE = "http://localhost:8083/users";
const DEPT_API = "http://localhost:8083/api/departments";
const API_URL=import.meta.env.VITE_API_URL
export default function Employees() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [departments, setDepartments] = useState([]);

  // Modal states
  const [isEditingOpen, setIsEditingOpen] = useState(false);
  const [editingEmp, setEditingEmp] = useState(null);
  const [editData, setEditData] = useState({
    fullname: "",
    dob: "",
    department: "",
    gender: "",
    maritalStatus: "",
    image: "",
  });

  // View modal states
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewEmp, setViewEmp] = useState(null);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(`${API_URL}/users/getAllUsers`);
      setEmployees(res.data || []);
    } catch (err) {
      console.error("Error fetching employees:", err);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/departments`);
      setDepartments(res.data || []);
    } catch (err) {
      console.error("Error fetching departments:", err);
      setDepartments([]);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
  }, []);

  // Open edit modal
  const openEditModal = (emp) => {
    setEditingEmp(emp);
    setEditData({
      fullname: emp.fullname || "",
      dob: emp.dob || "",
      department: emp.department || "",
      gender: emp.gender || "",
      maritalStatus: emp.maritalStatus || "",
      image: emp.image || "",
    });
    setIsEditingOpen(true);
  };

  const closeEditModal = () => {
    setIsEditingOpen(false);
    setEditingEmp(null);
    setEditData({
      fullname: "",
      dob: "",
      department: "",
      gender: "",
      maritalStatus: "",
      image: "",
    });
  };

  // Save edit
  const handleSave = async () => {
    try {
      const id = editingEmp.empid ?? editingEmp.id;
      const res = await axios.put(`${API_URL}/users/${id}`, editData);
      const updated = res.data || { ...editingEmp, ...editData };
      setEmployees((prev) =>
        prev.map((e) => ((e.empid ?? e.id) === id ? updated : e))
      );
      closeEditModal();
    } catch (err) {
      console.error("Failed to save employee:", err);
    }
  };

  // Delete employee
  const handleDelete = async (emp) => {
    try {
      const id = emp.empid ?? emp.id;
      await axios.delete(`${API_URL}/users/${id}`);
      setEmployees((prev) => prev.filter((e) => (e.empid ?? e.id) !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  // Open view modal
  const openViewModal = (emp) => {
    setViewEmp(emp);
    setIsViewOpen(true);
  };

  const closeViewModal = () => {
    setIsViewOpen(false);
    setViewEmp(null);
  };

  const filteredEmployees = searchId
    ? employees.filter((emp) =>
        (emp.empid ?? emp.id)
          .toString()
          .toLowerCase()
          .includes(searchId.toLowerCase())
      )
    : employees;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Employee List</h2>

      <div style={styles.controls}>
        <input
          type="text"
          placeholder="Search by Employee ID"
          style={styles.searchInput}
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />
        <button style={styles.addBtn} onClick={() => navigate("/addemployee")}>
          Add New Employee
        </button>
      </div>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>ID</th>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>DOB</th>
            <th style={styles.th}>Department</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.length > 0 ? (
            filteredEmployees.map((emp) => (
              <tr key={emp.empid ?? emp.id}>
                <td style={styles.td}>{emp.empid ?? emp.id}</td>
                <td style={styles.td}>{emp.fullname}</td>
                <td style={styles.td}>{emp.dob}</td>
                <td style={styles.td}>{emp.department}</td>
                <td style={styles.td}>
                  <div style={{ display: "flex", gap: 10 }}>
                    <button
                      style={styles.viewBtn}
                      onClick={() => openViewModal(emp)}
                    >
                      View
                    </button>
                    <button
                      style={styles.editBtn}
                      onClick={() => openEditModal(emp)}
                    >
                      Edit
                    </button>
                    <button
                      style={styles.deleteBtn}
                      onClick={() => handleDelete(emp)}
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

      {/* ===== View Employee Modal ===== */}
      {isViewOpen && viewEmp && (
        <div style={styles.modalOverlay} onMouseDown={closeViewModal}>
          <div style={styles.viewModal} onMouseDown={(e) => e.stopPropagation()}>
            <h3 style={{ marginTop: 0, textAlign: "center" }}>Employee Details</h3>
            <div style={styles.viewContent}>
              <img
                src={viewEmp.photo || "https://via.placeholder.com/120"}
                alt="Employee"
                style={styles.viewImage}
              />
              <div style={styles.viewInfo}>
                <p><strong>ID:</strong> {viewEmp.empid ?? viewEmp.id}</p>
                <p><strong>Name:</strong> {viewEmp.fullname}</p>
                <p><strong>DOB:</strong> {viewEmp.dob}</p>
                <p><strong>Gender:</strong> {viewEmp.gender}</p>
                <p><strong>Department:</strong> {viewEmp.department}</p>
                <p><strong>Marital Status:</strong> {viewEmp.maritalStatus}</p>
              </div>
            </div>
            <div style={{ textAlign: "right", marginTop: 15 }}>
              <button style={styles.closeBtn} onClick={closeViewModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== Edit Modal ===== */}
      {isEditingOpen && (
        <div style={styles.modalOverlay} onMouseDown={closeEditModal}>
          <div style={styles.modal} onMouseDown={(e) => e.stopPropagation()}>
            <h3 style={{ marginTop: 0 }}>Edit Employee</h3>

            <label style={styles.label}>Full Name</label>
            <input
              style={styles.input}
              value={editData.fullname}
              onChange={(e) => setEditData({ ...editData, fullname: e.target.value })}
            />

            <label style={styles.label}>Date of Birth</label>
            <input
              type="date"
              style={styles.input}
              value={editData.dob}
              onChange={(e) => setEditData({ ...editData, dob: e.target.value })}
            />

            <label style={styles.label}>Department</label>
            <select
              style={styles.input}
              value={editData.department}
              onChange={(e) => setEditData({ ...editData, department: e.target.value })}
            >
              <option value="">-- Select Department --</option>
              {departments.length > 0 ? (
                departments.map((d) => (
                  <option key={d.id} value={d.name}>
                    {d.name}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  No departments available
                </option>
              )}
            </select>

            <label style={styles.label}>Gender</label>
            <select
              style={styles.input}
              value={editData.gender}
              onChange={(e) => setEditData({ ...editData, gender: e.target.value })}
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>

            <label style={styles.label}>Marital Status</label>
            <select
              style={styles.input}
              value={editData.maritalStatus}
              onChange={(e) =>
                setEditData({ ...editData, maritalStatus: e.target.value })
              }
            >
              <option value="">Select</option>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
            </select>

            <label style={styles.label}>Image URL</label>
            <input
              style={styles.input}
              value={editData.image}
              onChange={(e) => setEditData({ ...editData, image: e.target.value })}
            />

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 12 }}>
              <button style={styles.cancelBtn} onClick={closeEditModal}>
                Cancel
              </button>
              <button style={styles.saveBtn} onClick={handleSave}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { padding: 20, fontFamily: "Arial, sans-serif" },
  title: { marginBottom: 12 },
  controls: { display: "flex", gap: 10, marginBottom: 12, alignItems: "center" },
  searchInput: { padding: 8, borderRadius: 4, border: "1px solid #ccc", minWidth: 220 },
  addBtn: { padding: "8px 12px", borderRadius: 6, border: "none", background: "#1976d2", color: "white", cursor: "pointer" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { borderBottom: "1px solid #eee", textAlign: "left", padding: 8 },
  td: { padding: 8, borderBottom: "1px solid #f4f4f4" },
  viewBtn: { padding: "6px 8px", borderRadius: 4, border: "1px solid #1976d2", background: "white", cursor: "pointer" },
  editBtn: { padding: "6px 8px", borderRadius: 4, border: "none", background: "#ffb300", cursor: "pointer" },
  deleteBtn: { padding: "6px 8px", borderRadius: 4, border: "none", background: "#e53935", color: "white", cursor: "pointer" },
  modalOverlay: {
    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)", display: "flex",
    alignItems: "center", justifyContent: "center", zIndex: 9999,
  },
  modal: {
    width: 520, maxWidth: "95%", background: "white", padding: 20,
    borderRadius: 8, boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
  },
  label: { display: "block", marginTop: 8, marginBottom: 4, fontSize: 13, color: "#333" },
  input: { width: "100%", padding: 8, borderRadius: 4, border: "1px solid #ccc", boxSizing: "border-box" },
  saveBtn: { padding: "8px 12px", borderRadius: 6, border: "none", background: "#2e7d32", color: "white", cursor: "pointer" },
  cancelBtn: { padding: "8px 12px", borderRadius: 6, border: "1px solid #999", background: "white", cursor: "pointer" },

  // View modal styles
  viewModal: {
    width: 450, maxWidth: "90%", background: "white", padding: 20,
    borderRadius: 10, boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
  },
  viewContent: { display: "flex", gap: 20, alignItems: "flex-start" },
  viewImage: {
    width: 120, height: 120, borderRadius: "50%",
    border: "3px solid #1976d2", objectFit: "cover",
  },
  viewInfo: { lineHeight: "1.6" },
  closeBtn: {
    padding: "8px 12px", borderRadius: 6, border: "none",
    background: "#1976d2", color: "white", cursor: "pointer",
  },
};
