import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Leaves.css";

const BASEURL = "http://localhost:5000"; 

export default function Leaves() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [leaves, setLeaves] = useState([]);

  // Fetch all leaves from backend
  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const res = await axios.get(BASEURL);
      setLeaves(res.data);
    } catch (err) {
      console.error("Error fetching leaves:", err);
    }
  };

  // Filter leaves by search + status
  const filteredLeaves = leaves.filter(
    (l) =>
      l.empId.toLowerCase().includes(search.toLowerCase()) &&
      (filter === "All" || l.status === filter)
  );

  // Handle Accept / Reject
  const handleStatusChange = async (status) => {
    try {
      await axios.put(`${BASEURL}/${selectedLeave.id}`, {
        ...selectedLeave,
        status,
      });
      fetchLeaves(); // refresh after update
      setSelectedLeave(null);
    } catch (err) {
      console.error("Error updating leave:", err);
    }
  };

  return (
    <div className="leaves-container">
      <h2 className="leaves-title">Manage Leaves</h2>

      {/* Top Bar */}
      <div className="leaves-topbar">
        <input
          type="text"
          placeholder="Search By Emp ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="leaves-search"
        />

        <div className="filter-buttons">
          <button
            className={`filter-btn ${filter === "Pending" ? "active" : ""}`}
            onClick={() => setFilter("Pending")}
          >
            Pending
          </button>
          <button
            className={`filter-btn ${filter === "Approved" ? "active" : ""}`}
            onClick={() => setFilter("Approved")}
          >
            Approved
          </button>
          <button
            className={`filter-btn ${filter === "Rejected" ? "active" : ""}`}
            onClick={() => setFilter("Rejected")}
          >
            Rejected
          </button>
          <button
            className={`filter-btn ${filter === "All" ? "active" : ""}`}
            onClick={() => setFilter("All")}
          >
            All
          </button>
        </div>
      </div>

      {/* Leave Table */}
      <table className="leaves-table">
        <thead>
          <tr>
            <th>S No</th>
            <th>Emp ID</th>
            <th>Name</th>
            <th>Leave Type</th>
            <th>Department</th>
            <th>Days</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredLeaves.length > 0 ? (
            filteredLeaves.map((l, index) => (
              <tr key={l.id}>
                <td>{index + 1}</td>
                <td>{l.empId}</td>
                <td>{l.name}</td>
                <td>{l.type}</td>
                <td>{l.dept}</td>
                <td>{l.days}</td>
                <td>
                  <span className={`status-badge ${l.status.toLowerCase()}`}>
                    {l.status}
                  </span>
                </td>
                <td>
                  <button
                    className="view-btn"
                    onClick={() => setSelectedLeave(l)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8">No leave records found.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal */}
      {selectedLeave && (
        <div className="modal-overlay" onClick={() => setSelectedLeave(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Leave Details</h3>
            <div className="modal-body">
              <p><strong>Name:</strong> {selectedLeave.name}</p>
              <p><strong>Employee ID:</strong> {selectedLeave.empId}</p>
              <p><strong>Leave Type:</strong> {selectedLeave.type}</p>
              <p><strong>Reason:</strong> {selectedLeave.reason}</p>
              <p><strong>Department:</strong> {selectedLeave.dept}</p>
              <p><strong>Start Date:</strong> {selectedLeave.startDate}</p>
              <p><strong>End Date:</strong> {selectedLeave.endDate}</p>
              <p><strong>Days:</strong> {selectedLeave.days}</p>
            </div>
            <div className="modal-actions">
              <button
                className="accept-btn"
                onClick={() => handleStatusChange("Approved")}
              >
                Accept
              </button>
              <button
                className="reject-btn"
                onClick={() => handleStatusChange("Rejected")}
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
