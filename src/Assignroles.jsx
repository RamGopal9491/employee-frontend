import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Assignroles.css";

export default function AssignRoles() {
  // 🔹 Base URL
  const BASEURL = "http://localhost:8083/";

  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [newRole, setNewRole] = useState("");

  // ✅ Fetch employees on page load
  useEffect(() => {
    axios
      .get(`${BASEURL}api/assignroles`)
      .then((res) => setEmployees(res.data))
      .catch((err) => console.error("Error fetching employees:", err));
  }, []);

  const openModal = (employee) => {
    setSelectedEmployee(employee);
    setNewRole(employee.role);
  };

  const closeModal = () => {
    setSelectedEmployee(null);
    setNewRole("");
  };

  // ✅ Save new role to backend
  const handleSaveRole = () => {
    axios
      .put(`${BASEURL}api/assignroles/${selectedEmployee.id}/role`, {
        role: newRole,
      })
      .then(() => {
        setEmployees(
          employees.map((emp) =>
            emp.id === selectedEmployee.id ? { ...emp, role: newRole } : emp
          )
        );
        closeModal();
      })
      .catch((err) => console.error("Error updating role:", err));
  };

  return (
    <div className="roles-container">
      <h2 className="roles-title">Assign Roles</h2>
      <table className="roles-table">
        <thead>
          <tr>
            <th>Employee Name</th>
            <th>Current Role</th>
            <th>Edit Role</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id}>
              <td>{emp.fullName}</td> {/* Updated to use fullName */}
              <td>{emp.role}</td>
              <td>
                <button className="edit-btn" onClick={() => openModal(emp)}>
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal Popup */}
      {selectedEmployee && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Edit Role for {selectedEmployee.fullName}</h3> {/* Updated */}
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
            >
              <option>Employee</option>
              <option>Manager</option>
              <option>Admin</option>
              <option>HR</option>
            </select>
            <div className="modal-actions">
              <button onClick={handleSaveRole} className="save-btn">
                Save
              </button>
              <button onClick={closeModal} className="cancel-btn">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
