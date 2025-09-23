import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Leave.css";

const BASEURL = "http://localhost:8083/";

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
    // console.log("first")
  const fetchLeaves = async () => {
    try {
      const res = await axios.get("http://localhost:8083/api/leaves/emp/");
      setLeaveList(res.data);
    } catch (err) {
      console.error("Error fetching leaves:", err);
      alert("Failed to load leave records");
    }
  };

  useEffect(() => {
    fetchLeaves();
    // eslint-disable-next-line
  }, []);

  // ✅ Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const start = new Date(leaveData.from);
      const end = new Date(leaveData.to);

      if (end < start) {
        alert("End date cannot be before start date");
        return;
      }

      const days = (end - start) / (1000 * 60 * 60 * 24) + 1;

      const newLeave = {
        empId: leaveData.empId,
        name: leaveData.name,
        dept: leaveData.dept,
        type: leaveData.type,
        reason: leaveData.description,
        startDate: leaveData.from,
        endDate: leaveData.to,
        days: days,
        appliedDate: new Date().toISOString().split("T")[0],
        status: "Pending",
      };

      const res = await axios.post(BASEURL, newLeave);

      if (res.status === 200 || res.status === 201) {
        alert("Leave applied successfully!");
        fetchLeaves();
        // Reset form
        setLeaveData({
          ...leaveData,
          type: "",
          from: "",
          to: "",
          description: "",
        });
        setShowForm(false);
      } else {
        alert("Failed to apply leave. Please try again.");
      }
    } catch (err) {
      console.error("Error applying leave:", err);
      alert("Error while applying leave");
    }
  };

  // ✅ Filter leaves by status
  const filteredLeaves = leaveList.filter((leave) =>
    leave.status
      ? leave.status.toLowerCase().includes(search.toLowerCase())
      : true
  );

  return (
    <div className="leave-container">
      <h2 className="leave-title">My Leaves</h2>

      {/* Top bar */}
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

      {/* Leave table */}
      <table className="leave-table">
        <thead>
          <tr>
            <th>SNO</th>
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
              <tr key={leave.id || index}>
                <td>{index + 1}</td>
                <td>{leave.type}</td>
                <td>{leave.startDate}</td>
                <td>{leave.endDate}</td>
                <td>{leave.days}</td>
                <td>{leave.reason}</td>
                <td>{leave.appliedDate}</td>
                <td>
                  <span
                    className={
                      leave.status === "Approved"
                        ? "status-approved"
                        : leave.status === "Rejected"
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

      {/* Apply Leave Form */}
      {showForm && (
        <div className="leave-form-overlay">
          <div className="leave-form-popup">
            <h3 className="form-title">Apply Leave</h3>
            <form onSubmit={handleSubmit}>
              <label>Leave Type</label>
              <select
                value={leaveData.type}
                onChange={(e) =>
                  setLeaveData({ ...leaveData, type: e.target.value })
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
                  setLeaveData({ ...leaveData, from: e.target.value })
                }
                required
              />

              <label>To</label>
              <input
                type="date"
                value={leaveData.to}
                onChange={(e) =>
                  setLeaveData({ ...leaveData, to: e.target.value })
                }
                required
              />

              <label>Description</label>
              <textarea
                rows="3"
                value={leaveData.description}
                onChange={(e) =>
                  setLeaveData({ ...leaveData, description: e.target.value })
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
