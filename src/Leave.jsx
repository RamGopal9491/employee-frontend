import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Leave.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function Leave() {
  
  const [leaveList, setLeaveList] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [leaveData, setLeaveData] = useState({
    empId: "",
    name: "",
    dept: "",
    type: "",
    from: "",
    to: "",
    description: "",
  });

  // read logged in user (adjust key names to whatever you store in localStorage)
  const user = JSON.parse(localStorage.getItem("user")); // e.g. { empId, name, department }

  // Fetch leaves for logged-in user and normalize backend shape
  const fetchLeaves = async (empId) => {
    try {
      const res = await axios.get(`${API_URL}/api/leaves/emp/${empId}`);
      // backend returns array of leaves with nested `user` object
      const normalized = (res.data || []).map((l) => ({
        leaveId: l.leaveId || l.id,
        empId: l.user?.empid ?? l.user?.empId ?? empId,
        name: l.user?.fullname ?? l.user?.name ?? leaveData.name,
        dept: l.user?.department ?? l.user?.dept ?? leaveData.dept,
        type: l.type,
        startDate: l.startDate,
        endDate: l.endDate,
        days: l.days,
        reason: l.reason,
        status: l.status ?? "Pending",
        appliedDate: l.appliedDate ?? l.appliedDate, // use as-is if present
      }));
      setLeaveList(normalized);
    } catch (err) {
      console.error("Error fetching leaves:", err);
      alert("Failed to load leave records");
    }
  };

  useEffect(() => {
    if (user && (user.empId || user.empid)) {
      const emp = user.empId ?? user.empid;
      // initialize leaveData based on logged-in user
      setLeaveData((prev) => ({
        ...prev,
        empId: emp,
        name: user.name ?? user.fullname ?? prev.name,
        dept: user.department ?? user.dept ?? prev.dept,
      }));
      fetchLeaves(emp);
    }
    // intentionally only on mount / when local user changes in storage
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // keep empty to run once on mount

  // Apply Leave
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const start = new Date(leaveData.from);
      const end = new Date(leaveData.to);

      if (end < start) {
        alert("End date cannot be before start date");
        return;
      }

      const days = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;

      const newLeave = {
        // match your backend expected payload keys (you used reason/startDate/endDate/days)
        empId: leaveData.empId,
        type: leaveData.type,
        reason: leaveData.description,
        startDate: leaveData.from,
        endDate: leaveData.to,
        days: days,
      };

      const res = await axios.post(`${API_URL}/api/leaves`, newLeave);

      if (res.status === 200 || res.status === 201) {
        alert("Leave applied successfully!");
        // refresh leaves for this employee
        fetchLeaves(leaveData.empId);
        setShowForm(false);
        setLeaveData((prev) => ({
          ...prev,
          type: "",
          from: "",
          to: "",
          description: "",
        }));
      }
    } catch (err) {
      console.error("Error applying leave:", err);
      alert("Failed to apply leave");
    }
  };

  // filter by status text in search box
  const filteredLeaves = leaveList.filter((leave) =>
    search.trim()
      ? (leave.status ?? "")
          .toString()
          .toLowerCase()
          .includes(search.toLowerCase())
      : true
  );

  // helper to present YYYY-MM-DD or ISO to user-friendly date
  const fmtDate = (d) => {
    if (!d) return "";
    // if already YYYY-MM-DD, new Date(...) will create local midnight - that's ok for display
    try {
      const dt = new Date(d);
      if (isNaN(dt.getTime())) return d;
      return dt.toLocaleDateString();
    } catch {
      return d;
    }
  };

  return (
    <div className="leave-container">
      <h2 className="leave-title">My Leaves</h2>

      <div className="leave-topbar">
        <input
          type="text"
          placeholder="Search By Status"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="leave-search"
        />
        <button className="btn-add" onClick={() => setShowForm(true)}>
          Apply Leave
        </button>
      </div>

      <table className="leave-table">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Leave Type</th>
            <th>From</th>
            <th>To</th>
            <th>Days</th>
            <th>Reason</th>
            <th>Applied Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredLeaves.length > 0 ? (
            filteredLeaves.map((leave, index) => (
              <tr key={leave.leaveId || index}>
                <td>{index + 1}</td>
                <td>{leave.type}</td>
                <td>{fmtDate(leave.startDate)}</td>
                <td>{fmtDate(leave.endDate)}</td>
                <td>{leave.days}</td>
                <td>{leave.reason}</td>
                <td>{fmtDate(leave.appliedDate)}</td>
                <td>
                  <span
                    className={
                      (leave.status || "").toLowerCase() === "approved"
                        ? "status-approved"
                        : (leave.status || "").toLowerCase() === "rejected"
                        ? "status-rejected"
                        : "status-pending"
                    }
                  >
                    {leave.status}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="no-records">
                No leave records found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {showForm && (
        <div className="leave-form-overlay">
          <div className="leave-form-popup">
            <h3 className="form-title">Apply Leave</h3>
            <form onSubmit={handleSubmit}>
              <label>Leave Type</label>
              <select
                value={leaveData.type}
                onChange={(e) =>
                  setLeaveData((prev) => ({ ...prev, type: e.target.value }))
                }
                required
              >
                <option value="">Select</option>
                <option value="Sick Leave">Sick Leave</option>
                <option value="Casual Leave">Casual Leave</option>
                <option value="Annual Leave">Annual Leave</option>
              </select>

              <label>From</label>
              <input
                type="date"
                value={leaveData.from}
                onChange={(e) =>
                  setLeaveData((prev) => ({ ...prev, from: e.target.value }))
                }
                required
              />

              <label>To</label>
              <input
                type="date"
                value={leaveData.to}
                onChange={(e) =>
                  setLeaveData((prev) => ({ ...prev, to: e.target.value }))
                }
                required
              />

              <label>Description</label>
              <textarea
                rows="3"
                value={leaveData.description}
                onChange={(e) =>
                  setLeaveData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              ></textarea>

              <div className="form-buttons">
                <button type="submit" className="btn-submit">
                  Submit
                </button>
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
