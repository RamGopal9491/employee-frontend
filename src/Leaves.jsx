// Leaves.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Leaves.css";

const BASEURL = "http://localhost:8083";

function normalizeLeave(l) {
  const raw = l || {};

  const id = raw.leaveId || raw.id || raw._id || "";
  const empId =
    raw.empId ||
    raw.empid ||
    (raw.user && (raw.user.empid || raw.user.empId)) ||
    "";
  const name =
    raw.name || raw.fullname || (raw.user && (raw.user.fullname || raw.user.name)) || "";
  const dept = raw.dept || raw.department || (raw.user && raw.user.department) || "";
  const type = raw.type || raw.leaveType || "";
  const days = raw.days ?? raw.noOfDays ?? "";
  const status = raw.status || "";
  const reason = raw.reason || "";
  const startDate = raw.startDate || "";
  const endDate = raw.endDate || "";
  const appliedDate = raw.appliedDate || "";

  return {
    id,
    empId: empId.toString(),
    name,
    dept,
    type,
    days,
    status,
    reason,
    startDate,
    endDate,
    appliedDate,
    __raw: raw,
  };
}

export default function Leaves() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);
  const API_URL=import.meta.env.VITE_API_URL

  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_URL}/api/leaves`);
      const rawData = Array.isArray(res.data) ? res.data : [];
      const normalized = rawData.map(normalizeLeave);
      setLeaves(normalized);
      console.log("Fetched leaves (normalized):", normalized);
    } catch (err) {
      console.error("Error fetching leaves:", err);
      setError("Failed to load leaves.");
    } finally {
      setLoading(false);
    }
  };

  const filteredLeaves = leaves.filter((l) => {
    const empIdStr = (l.empId || "").toString().toLowerCase();
    const statusStr = (l.status || "").toString().toLowerCase();
    const searchStr = (search || "").toString().toLowerCase();

    const matchesSearch = empIdStr.includes(searchStr);
    const matchesFilter = filter === "All" || statusStr === filter.toLowerCase();

    return matchesSearch && matchesFilter;
  });

  // call backend approve/reject endpoints that your controller exposes
  const handleStatusChange = async (action) => {
    if (!selectedLeave) return;
    setUpdating(true);
    setError(null);

    const id = selectedLeave.id;
    if (!id) {
      setError("Cannot update: leave id is missing.");
      setUpdating(false);
      return;
    }

    // choose route based on action ('approve' / 'reject')
    const actionPath = action === "approve" ? "approve" : "reject";
    try {
      // Your backend methods don't require a body; send empty PUT.
      await axios.put(`${API_URL}/api/leaves/${encodeURIComponent(id)}/${actionPath}`);

      // Refresh and close modal
      await fetchLeaves();
      setSelectedLeave(null);
    } catch (err) {
      console.error(`Error ${actionPath}ing leave:`, err);
      setError(`Failed to ${actionPath} leave.`);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="leaves-container">
      <h2 className="leaves-title">Manage Leaves</h2>

      <div className="leaves-topbar">
        <input
          type="text"
          placeholder="Search By Emp ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="leaves-search"
        />

        <div className="filter-buttons">
          {["Pending", "Approved", "Rejected", "All"].map((f) => (
            <button
              key={f}
              className={`filter-btn ${filter === f ? "active" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p>Loading leaves...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <>
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
                filteredLeaves.map((l, index) => {
                  const key = l.id || index;
                  return (
                    <tr key={key}>
                      <td>{index + 1}</td>
                      <td>{l.empId || "-"}</td>
                      <td>{l.name || "-"}</td>
                      <td>{l.type || "-"}</td>
                      <td>{l.dept || "-"}</td>
                      <td>{l.days ?? "-"}</td>
                      <td>
                        <span
                          className={`status-badge ${
                            (l.status || "").toLowerCase() || "unknown"
                          }`}
                        >
                          {l.status || "Unknown"}
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
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8">No leave records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </>
      )}

      {selectedLeave && (
        <div className="modal-overlay" onClick={() => setSelectedLeave(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Leave Details</h3>

            <div className="modal-body">
              <div className="modal-info">
                <p>
                  <strong>Name:</strong> {selectedLeave.name || "-"}
                </p>
                <p>
                  <strong>Employee ID:</strong> {selectedLeave.empId || "-"}
                </p>
                <p>
                  <strong>Leave Type:</strong> {selectedLeave.type || "-"}
                </p>
                <p>
                  <strong>Reason:</strong> {selectedLeave.reason || "-"}
                </p>
                <p>
                  <strong>Department:</strong> {selectedLeave.dept || "-"}
                </p>
                <p>
                  <strong>Start Date:</strong> {selectedLeave.startDate || "-"}
                </p>
                <p>
                  <strong>End Date:</strong> {selectedLeave.endDate || "-"}
                </p>
                <p>
                  <strong>Days:</strong> {selectedLeave.days ?? "-"}
                </p>
                <p>
                  <strong>Applied:</strong> {selectedLeave.appliedDate || "-"}
                </p>
                <p>
                  <strong>Status:</strong> {selectedLeave.status || "Unknown"}
                </p>
              </div>
            </div>

            <div className="modal-actions">
              <button
                className="accept-btn"
                onClick={() => handleStatusChange("approve")}
                disabled={updating || selectedLeave.status === "Approved"}
                title={
                  selectedLeave.status === "Approved"
                    ? "Already approved"
                    : "Approve leave"
                }
              >
                {updating ? "Processing..." : "Accept"}
              </button>

              <button
                className="reject-btn"
                onClick={() => handleStatusChange("reject")}
                disabled={updating || selectedLeave.status === "Rejected"}
                title={
                  selectedLeave.status === "Rejected"
                    ? "Already rejected"
                    : "Reject leave"
                }
              >
                {updating ? "Processing..." : "Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
